/**
 * ID Card Corner Detection Engine
 * Combines OpenCV.js traditional CV + ONNX model for robust detection.
 */

class IDCardDetector {
    constructor() {
        this.cvReady = false;
        this.modelReady = false;
        this.model = null;
        this.modelInputSize = 320; // Default input size for segmentation model
    }

    setCVReady() {
        this.cvReady = true;
    }

    /**
     * Load ONNX segmentation model for enhanced detection.
     * Model should accept [1, 3, H, W] input and output [1, 1, H, W] mask.
     * Works with U2-Net, IS-Net, or similar salient object detection models.
     */
    async loadModel(modelUrl, inputSize = 320) {
        try {
            this.model = await ort.InferenceSession.create(modelUrl, {
                executionProviders: ['wasm'],
            });
            this.modelInputSize = inputSize;
            this.modelReady = true;
            console.log('ONNX model loaded successfully');
            return true;
        } catch (e) {
            console.warn('Failed to load ONNX model:', e.message);
            this.modelReady = false;
            return false;
        }
    }

    /**
     * Model-based segmentation detection.
     * Uses ONNX model to generate card mask, then finds contour.
     */
    async _strategyModel(src) {
        if (!this.modelReady || !this.model) return null;

        const h = src.rows, w = src.cols;
        const size = this.modelInputSize;

        // Prepare input tensor: resize + normalize
        const resized = new cv.Mat();
        cv.resize(src, resized, new cv.Size(size, size));

        // Convert RGBA to RGB float32
        const rgb = new cv.Mat();
        cv.cvtColor(resized, rgb, cv.COLOR_RGBA2RGB);

        // Normalize to [0, 1] and create CHW tensor
        const inputData = new Float32Array(3 * size * size);
        const data = rgb.data;
        for (let i = 0; i < size * size; i++) {
            inputData[i] = data[i * 3] / 255.0;                 // R
            inputData[size * size + i] = data[i * 3 + 1] / 255.0; // G
            inputData[2 * size * size + i] = data[i * 3 + 2] / 255.0; // B
        }

        resized.delete();
        rgb.delete();

        try {
            // Run inference
            const inputTensor = new ort.Tensor('float32', inputData, [1, 3, size, size]);
            const inputName = this.model.inputNames[0];
            const outputName = this.model.outputNames[0];
            const results = await this.model.run({ [inputName]: inputTensor });
            const output = results[outputName];

            // Convert output to mask
            const maskData = output.data;
            const mask = new cv.Mat(size, size, cv.CV_8UC1);
            for (let i = 0; i < size * size; i++) {
                // Sigmoid + threshold
                const val = 1.0 / (1.0 + Math.exp(-maskData[i]));
                mask.data[i] = val > 0.5 ? 255 : 0;
            }

            // Resize mask back to original size
            const fullMask = new cv.Mat();
            cv.resize(mask, fullMask, new cv.Size(w, h));
            mask.delete();

            // Clean up mask
            const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
            cv.morphologyEx(fullMask, fullMask, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 3);
            cv.morphologyEx(fullMask, fullMask, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 2);
            kernel.delete();

            // Find contour on mask
            const result = this._findBestContour(fullMask, src);
            fullMask.delete();

            return result;
        } catch (e) {
            console.warn('Model inference failed:', e.message);
            return null;
        }
    }

    /**
     * Main detection entry point. Tries multiple strategies.
     * Returns: { corners: [[x,y],...] (4 points, ordered TL,TR,BR,BL), method: string, score: number }
     * or null if detection fails.
     */
    detect(imageData, width, height) {
        if (!this.cvReady) return null;

        const src = cv.matFromImageData(imageData);
        let result = null;

        try {
            // Strategy 1: Canny edge detection
            result = this._strategyCanny(src);
            if (result && result.score >= 50) {
                result.method = 'auto_canny';
                return result;
            }

            // Strategy 2: Color/Otsu thresholding
            let r2 = this._strategyOtsu(src);
            if (r2 && r2.score > (result ? result.score : 0)) {
                result = r2;
                result.method = 'auto_otsu';
            }

            // Strategy 3: Saturation-based
            let r3 = this._strategySaturation(src);
            if (r3 && r3.score > (result ? result.score : 0)) {
                result = r3;
                result.method = 'auto_saturation';
            }

            // Strategy 4: Brightness-based
            let r4 = this._strategyBrightness(src);
            if (r4 && r4.score > (result ? result.score : 0)) {
                result = r4;
                result.method = 'auto_brightness';
            }

            if (result && result.score >= 20) {
                return result;
            }

            return null;
        } finally {
            src.delete();
        }
    }

    /**
     * Async detection that also tries the ONNX model.
     * Use this when model is loaded for better accuracy on difficult images.
     */
    async detectAsync(imageData, width, height) {
        // First try CV-based detection
        const cvResult = this.detect(imageData, width, height);

        // If CV gives high confidence, use it directly
        if (cvResult && cvResult.score >= 60) {
            return cvResult;
        }

        // Try model-based detection if available
        if (this.modelReady) {
            const src = cv.matFromImageData(imageData);
            try {
                const modelResult = await this._strategyModel(src);
                if (modelResult) {
                    modelResult.method = 'model';
                    // Use model result if it scores higher
                    if (!cvResult || modelResult.score > cvResult.score) {
                        return modelResult;
                    }
                }
            } finally {
                src.delete();
            }
        }

        return cvResult;
    }

    _strategyCanny(src) {
        const gray = new cv.Mat();
        const blurred = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

        const thresholds = [[30, 100], [50, 150], [20, 80], [75, 200], [40, 120]];
        let best = null;

        for (const [low, high] of thresholds) {
            const edges = new cv.Mat();
            cv.Canny(blurred, edges, low, high);

            const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
            cv.dilate(edges, edges, kernel);
            kernel.delete();

            const result = this._findBestContour(edges, src);
            if (result && (!best || result.score > best.score)) {
                best = result;
            }
            edges.delete();

            if (best && best.score >= 50) break;
        }

        gray.delete();
        blurred.delete();
        return best;
    }

    _strategyOtsu(src) {
        const gray = new cv.Mat();
        const blurred = new cv.Mat();
        const otsu = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
        cv.threshold(blurred, otsu, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

        const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(7, 7));
        cv.morphologyEx(otsu, otsu, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 3);
        cv.morphologyEx(otsu, otsu, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 1);

        let result = this._findBestContour(otsu, src);

        // Try inverted
        if (!result || result.score < 30) {
            const inv = new cv.Mat();
            cv.bitwise_not(otsu, inv);
            cv.morphologyEx(inv, inv, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 3);
            cv.morphologyEx(inv, inv, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 1);
            const r2 = this._findBestContour(inv, src);
            if (r2 && (!result || r2.score > result.score)) {
                result = r2;
            }
            inv.delete();
        }

        gray.delete();
        blurred.delete();
        otsu.delete();
        kernel.delete();
        return result;
    }

    _strategySaturation(src) {
        const rgb = new cv.Mat();
        cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
        const hsv = new cv.Mat();
        cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);

        const channels = new cv.MatVector();
        cv.split(hsv, channels);
        const saturation = channels.get(1);

        let best = null;
        for (const thresh of [40, 50, 60, 30]) {
            const mask = new cv.Mat();
            cv.threshold(saturation, mask, thresh, 255, cv.THRESH_BINARY_INV);

            const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(7, 7));
            cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 3);
            cv.morphologyEx(mask, mask, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 2);
            kernel.delete();

            const result = this._findBestContour(mask, src);
            if (result && (!best || result.score > best.score)) {
                best = result;
            }
            mask.delete();

            if (best && best.score >= 50) break;
        }

        hsv.delete();
        rgb.delete();
        channels.delete();
        saturation.delete();
        return best;
    }

    _strategyBrightness(src) {
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        // Compute percentile-based threshold using manual histogram
        const totalPixels = gray.rows * gray.cols;
        const histogram = new Array(256).fill(0);
        const grayData = gray.data;
        for (let i = 0; i < totalPixels; i++) {
            histogram[grayData[i]]++;
        }

        // Find 30th and 70th percentile
        let p30 = 0, p70 = 0, cumSum = 0;
        for (let i = 0; i < 256; i++) {
            cumSum += histogram[i];
            if (cumSum >= totalPixels * 0.3 && p30 === 0) p30 = i;
            if (cumSum >= totalPixels * 0.7 && p70 === 0) p70 = i;
        }

        if (p70 - p30 < 30) {
            gray.delete();
            return null;
        }

        const threshVal = (p70 + p30) / 2;
        const mask = new cv.Mat();
        cv.threshold(gray, mask, threshVal, 255, cv.THRESH_BINARY);

        const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(7, 7));
        cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 3);
        cv.morphologyEx(mask, mask, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 2);

        const result = this._findBestContour(mask, src);

        gray.delete();
        mask.delete();
        kernel.delete();
        return result;
    }

    _findBestContour(binaryImg, srcImg) {
        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        cv.findContours(binaryImg, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        const h = srcImg.rows;
        const w = srcImg.cols;
        const minArea = h * w * 0.05;
        let candidates = [];

        // Get contour areas and sort
        let contourInfos = [];
        for (let i = 0; i < contours.size(); i++) {
            const cnt = contours.get(i);
            const area = cv.contourArea(cnt);
            if (area >= minArea) {
                contourInfos.push({ index: i, area: area });
            }
        }
        contourInfos.sort((a, b) => b.area - a.area);

        for (const info of contourInfos.slice(0, 10)) {
            const cnt = contours.get(info.index);
            const peri = cv.arcLength(cnt, true);

            // Try approxPolyDP with various epsilon
            for (const epsMult of [0.015, 0.02, 0.025, 0.03, 0.04, 0.05, 0.06]) {
                const approx = new cv.Mat();
                cv.approxPolyDP(cnt, approx, epsMult * peri, true);

                if (approx.rows === 4) {
                    const pts = [];
                    for (let j = 0; j < 4; j++) {
                        pts.push([approx.data32S[j * 2], approx.data32S[j * 2 + 1]]);
                    }
                    const score = this._scoreCandidate(pts, srcImg);
                    if (score > 0) {
                        candidates.push({ corners: this._orderPoints(pts), score: score });
                    }
                    approx.delete();
                    break;
                }
                approx.delete();
            }

            // Try minAreaRect as fallback
            if (info.area > minArea * 1.5) {
                const rect = cv.minAreaRect(cnt);
                const rectW = rect.size.width;
                const rectH = rect.size.height;
                if (rectW > 0 && rectH > 0) {
                    const ratio = Math.max(rectW, rectH) / Math.min(rectW, rectH);
                    if (ratio >= 1.2 && ratio <= 2.2) {
                        const vertices = cv.RotatedRect.points(rect);
                        const pts = vertices.map(v => [v.x, v.y]);
                        const score = this._scoreCandidate(pts, srcImg);
                        if (score > 0) {
                            candidates.push({ corners: this._orderPoints(pts), score: score });
                        }
                    }
                }
            }
        }

        contours.delete();
        hierarchy.delete();

        if (candidates.length === 0) return null;
        candidates.sort((a, b) => b.score - a.score);
        return candidates[0];
    }

    _scoreCandidate(pts, srcImg) {
        const h = srcImg.rows;
        const w = srcImg.cols;
        const ordered = this._orderPoints(pts);
        let score = 0;

        // Area check
        const area = this._polygonArea(ordered);
        const imgArea = h * w;
        const areaRatio = area / imgArea;
        if (areaRatio < 0.05 || areaRatio > 0.95) return -1;
        if (areaRatio >= 0.15 && areaRatio <= 0.70) score += 10;
        else if (areaRatio >= 0.10 && areaRatio <= 0.80) score += 5;

        // Aspect ratio check
        const w1 = this._dist(ordered[0], ordered[1]);
        const w2 = this._dist(ordered[3], ordered[2]);
        const h1 = this._dist(ordered[0], ordered[3]);
        const h2 = this._dist(ordered[1], ordered[2]);
        const avgW = (w1 + w2) / 2;
        const avgH = (h1 + h2) / 2;
        const ratio = Math.max(avgW, avgH) / Math.max(1, Math.min(avgW, avgH));

        if (ratio < 1.2 || ratio > 2.2) return -1;
        const ratioDiff = Math.abs(ratio - 1.585);
        if (ratioDiff < 0.1) score += 15;
        else if (ratioDiff < 0.2) score += 10;
        else if (ratioDiff < 0.3) score += 5;

        // Sample interior brightness using perspective warp
        try {
            const targetW = 100, targetH = 63;
            const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, ordered.flat());
            const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, targetW, 0, targetW, targetH, 0, targetH]);
            const M = cv.getPerspectiveTransform(srcPts, dstPts);
            const warped = new cv.Mat();
            cv.warpPerspective(srcImg, warped, M, new cv.Size(targetW, targetH));

            // Check brightness
            const grayW = new cv.Mat();
            cv.cvtColor(warped, grayW, cv.COLOR_RGBA2GRAY);
            const mean = cv.mean(grayW);
            const avgBrightness = mean[0];

            if (avgBrightness > 160) score += 20;
            else if (avgBrightness > 130) score += 15;
            else if (avgBrightness > 100) score += 8;
            else if (avgBrightness < 80) score -= 10;

            // Check edge density (text indicator)
            const edges = new cv.Mat();
            cv.Canny(grayW, edges, 50, 150);
            const edgePixels = cv.countNonZero(edges);
            const edgeDensity = edgePixels / (targetW * targetH);
            if (edgeDensity > 0.05 && edgeDensity < 0.3) score += 10;
            else if (edgeDensity < 0.02) score -= 10;

            // Check saturation (card is low saturation)
            const hsvW = new cv.Mat();
            const rgbW = new cv.Mat();
            cv.cvtColor(warped, rgbW, cv.COLOR_RGBA2RGB);
            cv.cvtColor(rgbW, hsvW, cv.COLOR_RGB2HSV);
            const hsvChannels = new cv.MatVector();
            cv.split(hsvW, hsvChannels);
            const satMean = cv.mean(hsvChannels.get(1));
            if (satMean[0] < 40) score += 10;
            else if (satMean[0] < 60) score += 5;
            else if (satMean[0] > 100) score -= 5;

            srcPts.delete(); dstPts.delete(); M.delete(); warped.delete();
            grayW.delete(); edges.delete(); hsvW.delete(); rgbW.delete(); hsvChannels.delete();
        } catch (e) {
            // If warp fails, just use geometric score
        }

        return score;
    }

    _orderPoints(pts) {
        // Order: top-left, top-right, bottom-right, bottom-left
        const sumArr = pts.map(p => p[0] + p[1]);
        const diffArr = pts.map(p => p[0] - p[1]);

        const tl = pts[sumArr.indexOf(Math.min(...sumArr))];
        const br = pts[sumArr.indexOf(Math.max(...sumArr))];
        const tr = pts[diffArr.indexOf(Math.max(...diffArr))];
        const bl = pts[diffArr.indexOf(Math.min(...diffArr))];

        return [tl, tr, br, bl];
    }

    _dist(p1, p2) {
        return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    }

    _polygonArea(pts) {
        let area = 0;
        const n = pts.length;
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += pts[i][0] * pts[j][1];
            area -= pts[j][0] * pts[i][1];
        }
        return Math.abs(area) / 2;
    }

    /**
     * Expand corners outward from centroid by a percentage.
     * This prevents cropping too tightly on the card boundary.
     */
    expandCorners(corners, imgWidth, imgHeight, expandPercent = 0.02) {
        // Calculate centroid
        const cx = corners.reduce((s, p) => s + p[0], 0) / 4;
        const cy = corners.reduce((s, p) => s + p[1], 0) / 4;

        // Expand each corner away from centroid
        const expanded = corners.map(([x, y]) => {
            const dx = x - cx;
            const dy = y - cy;
            let nx = x + dx * expandPercent;
            let ny = y + dy * expandPercent;
            // Clamp to image bounds
            nx = Math.max(0, Math.min(imgWidth - 1, nx));
            ny = Math.max(0, Math.min(imgHeight - 1, ny));
            return [nx, ny];
        });
        return expanded;
    }

    /**
     * Perspective crop using detected corners.
     * Returns cropped ImageData.
     */
    perspectiveCrop(imageData, corners, outputWidth = 856, outputHeight = 540) {
        if (!this.cvReady) return null;

        const src = cv.matFromImageData(imageData);
        let ordered = [...corners];

        // Determine if we need to rotate the point ordering for landscape
        const w1 = this._dist(ordered[0], ordered[1]);
        const h1 = this._dist(ordered[0], ordered[3]);

        if (h1 > w1) {
            // Portrait detected, rotate points for landscape output
            ordered = [ordered[3], ordered[0], ordered[1], ordered[2]];
        }

        const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, ordered.flat());
        const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0, outputWidth, 0, outputWidth, outputHeight, 0, outputHeight
        ]);

        const M = cv.getPerspectiveTransform(srcPts, dstPts);
        const dst = new cv.Mat();
        cv.warpPerspective(src, dst, M, new cv.Size(outputWidth, outputHeight), cv.INTER_CUBIC, cv.BORDER_REPLICATE);

        // Convert to ImageData
        const resultCanvas = document.createElement('canvas');
        resultCanvas.width = outputWidth;
        resultCanvas.height = outputHeight;
        cv.imshow(resultCanvas, dst);
        const resultData = resultCanvas.getContext('2d').getImageData(0, 0, outputWidth, outputHeight);

        src.delete(); srcPts.delete(); dstPts.delete(); M.delete(); dst.delete();
        return resultData;
    }

    /**
     * Fix orientation using skin/face detection heuristics.
     * Returns rotation angle (0 or 180).
     */
    detectOrientation(imageData, width, height) {
        if (!this.cvReady) return 0;

        const src = cv.matFromImageData(imageData);
        const midX = Math.floor(width / 2);
        const midY = Math.floor(height / 2);

        // Convert to HSV for skin detection
        const rgb = new cv.Mat();
        const hsv = new cv.Mat();
        cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
        cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);

        // Skin color mask
        const lowerSkin1 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 20, 70, 0]);
        const upperSkin1 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [20, 150, 255, 0]);
        const skinMask1 = new cv.Mat();
        cv.inRange(hsv, lowerSkin1, upperSkin1, skinMask1);

        const lowerSkin2 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [160, 20, 70, 0]);
        const upperSkin2 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [180, 150, 255, 0]);
        const skinMask2 = new cv.Mat();
        cv.inRange(hsv, lowerSkin2, upperSkin2, skinMask2);

        const skinMask = new cv.Mat();
        cv.bitwise_or(skinMask1, skinMask2, skinMask);

        // Count skin pixels in quadrants
        const trSkin = cv.countNonZero(skinMask.roi(new cv.Rect(midX, 0, width - midX, midY)));
        const blSkin = cv.countNonZero(skinMask.roi(new cv.Rect(0, midY, midX, height - midY)));

        // Dark pixels (hair) detection
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        const darkMask = new cv.Mat();
        cv.threshold(gray, darkMask, 80, 255, cv.THRESH_BINARY_INV);

        const trDark = cv.countNonZero(darkMask.roi(new cv.Rect(midX, 0, width - midX, midY)));
        const blDark = cv.countNonZero(darkMask.roi(new cv.Rect(0, midY, midX, height - midY)));

        // Scoring
        let scoreCorrect = 0, scoreFlipped = 0;

        if (trSkin > blSkin * 1.5 && trSkin > 100) scoreCorrect += 3;
        else if (blSkin > trSkin * 1.5 && blSkin > 100) scoreFlipped += 3;

        if (trDark > blDark * 1.3 && trDark > 50) scoreCorrect += 2;
        else if (blDark > trDark * 1.3 && blDark > 50) scoreFlipped += 2;

        // Cleanup
        src.delete(); rgb.delete(); hsv.delete();
        lowerSkin1.delete(); upperSkin1.delete(); skinMask1.delete();
        lowerSkin2.delete(); upperSkin2.delete(); skinMask2.delete();
        skinMask.delete(); gray.delete(); darkMask.delete();

        return scoreFlipped > scoreCorrect ? 180 : 0;
    }
}

// Global instance
const detector = new IDCardDetector();
