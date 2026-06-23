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
        this.oriModel = null;
        this.oriModelReady = false;
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

        const resized = new cv.Mat();
        cv.resize(src, resized, new cv.Size(size, size));
        const rgb = new cv.Mat();
        cv.cvtColor(resized, rgb, cv.COLOR_RGBA2RGB);

        const mean = [0.485, 0.456, 0.406];
        const std = [0.229, 0.224, 0.225];
        const inputData = new Float32Array(3 * size * size);
        const data = rgb.data;
        for (let i = 0; i < size * size; i++) {
            inputData[i] = (data[i * 3] / 255.0 - mean[0]) / std[0];
            inputData[size * size + i] = (data[i * 3 + 1] / 255.0 - mean[1]) / std[1];
            inputData[2 * size * size + i] = (data[i * 3 + 2] / 255.0 - mean[2]) / std[2];
        }
        resized.delete();
        rgb.delete();

        try {
            const inputTensor = new ort.Tensor('float32', inputData, [1, 3, size, size]);
            const inputName = this.model.inputNames[0];
            const outputName = this.model.outputNames[0];
            const results = await this.model.run({ [inputName]: inputTensor });
            const output = results[outputName];
            const maskData = output.data;

            // Build clean mask at threshold 0.5
            const mask05 = new cv.Mat(size, size, cv.CV_8UC1);
            for (let i = 0; i < size * size; i++) {
                mask05.data[i] = maskData[i] > 0.5 ? 255 : 0;
            }
            const fullMask = new cv.Mat();
            cv.resize(mask05, fullMask, new cv.Size(w, h));
            mask05.delete();

            const kSize = Math.max(5, Math.round(Math.min(w, h) / 100));
            const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(kSize, kSize));
            cv.morphologyEx(fullMask, fullMask, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 3);
            cv.morphologyEx(fullMask, fullMask, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 2);
            kernel.delete();

            let candidates = [];

            // Strategy A: Direct contour on clean mask (no erosion)
            // Works when mask cleanly covers just the card
            const resultA = this._findBestContour(fullMask, src);
            if (resultA) candidates.push(resultA);

            // Strategy B: Hough line-based edge detection
            // Works when mask includes hand but card edges are still straight
            const resultB = this._findCardFromHoughLines(fullMask, src);
            if (resultB) candidates.push(resultB);

            // Strategy C: Erosion + connected component (for attached background objects)
            const erodeK = Math.max(3, Math.round(Math.min(w, h) / 80));
            const erodeKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(erodeK, erodeK));
            const erodedMask = new cv.Mat();
            cv.erode(fullMask, erodedMask, erodeKernel);
            const cardMask = this._selectCardComponent(erodedMask, fullMask, w, h);
            const resultC = this._findBestContour(cardMask, src);
            if (resultC) candidates.push(resultC);
            erodeKernel.delete();
            erodedMask.delete();
            cardMask.delete();

            fullMask.delete();

            if (candidates.length === 0) return null;
            candidates.sort((a, b) => b.score - a.score);
            return candidates[0];
        } catch (e) {
            console.warn('Model inference failed:', e.message);
            return null;
        }
    }

    /**
     * Find card rectangle using Hough line detection on mask edges.
     * Detects straight card edges even when hand is attached to mask.
     */
    _findCardFromHoughLines(binaryMask, srcImg) {
        const h = srcImg.rows, w = srcImg.cols;

        const edges = new cv.Mat();
        cv.Canny(binaryMask, edges, 50, 150);

        const lines = new cv.Mat();
        const minLineLen = Math.round(Math.min(w, h) / 8);
        cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 50, minLineLen, 20);
        edges.delete();

        if (lines.rows < 3) {
            lines.delete();
            return null;
        }

        // Classify lines as horizontal or vertical
        const hLines = []; // {y, x1, x2}
        const vLines = []; // {x, y1, y2}
        for (let i = 0; i < lines.rows; i++) {
            const x1 = lines.data32S[i * 4];
            const y1 = lines.data32S[i * 4 + 1];
            const x2 = lines.data32S[i * 4 + 2];
            const y2 = lines.data32S[i * 4 + 3];
            const angle = Math.abs(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
            if (angle < 15 || angle > 165) {
                hLines.push({ y: (y1 + y2) / 2, x1: Math.min(x1, x2), x2: Math.max(x1, x2) });
            } else if (angle > 75 && angle < 105) {
                vLines.push({ x: (x1 + x2) / 2, y1: Math.min(y1, y2), y2: Math.max(y1, y2) });
            }
        }
        lines.delete();

        if (hLines.length < 2 && vLines.length < 2) return null;

        // Cluster horizontal lines by y-coordinate
        hLines.sort((a, b) => a.y - b.y);
        const hClusters = this._clusterValues(hLines.map(l => l.y), Math.min(w, h) / 20);

        // Cluster vertical lines by x-coordinate
        vLines.sort((a, b) => a.x - b.x);
        const vClusters = this._clusterValues(vLines.map(l => l.x), Math.min(w, h) / 20);

        // Try to form rectangles from edge combinations
        let candidates = [];
        const CARD_RATIO = 1.585;

        if (hClusters.length >= 2 && vClusters.length >= 1) {
            // Have top, bottom, and at least one side
            for (let hi = 0; hi < hClusters.length - 1; hi++) {
                for (let hj = hi + 1; hj < hClusters.length; hj++) {
                    const top = hClusters[hi];
                    const bottom = hClusters[hj];
                    const hSpan = bottom - top;
                    if (hSpan < Math.min(w, h) * 0.1) continue;

                    for (const left of vClusters) {
                        // Compute right edge using aspect ratio
                        const wByRatio = hSpan * CARD_RATIO;
                        const hByRatio = hSpan / CARD_RATIO;

                        // Try both orientations: card horizontal or vertical in image
                        for (const expectedW of [wByRatio, hByRatio]) {
                            const right = left + expectedW;
                            if (right > 0 && right < w * 1.05) {
                                const pts = [[left, top], [right, top], [right, bottom], [left, bottom]];
                                const score = this._scoreCandidate(pts, srcImg);
                                if (score > 0) {
                                    candidates.push({ corners: this._orderPoints(pts), score: score });
                                }
                            }
                        }
                    }

                    // If we have right edge clusters too
                    for (const left of vClusters) {
                        for (const right of vClusters) {
                            if (right <= left) continue;
                            const pts = [[left, top], [right, top], [right, bottom], [left, bottom]];
                            const score = this._scoreCandidate(pts, srcImg);
                            if (score > 0) {
                                candidates.push({ corners: this._orderPoints(pts), score: score });
                            }
                        }
                    }
                }
            }
        }

        if (hClusters.length >= 1 && vClusters.length >= 2) {
            // Have left, right, and at least one horizontal edge
            for (let vi = 0; vi < vClusters.length - 1; vi++) {
                for (let vj = vi + 1; vj < vClusters.length; vj++) {
                    const left = vClusters[vi];
                    const right = vClusters[vj];
                    const wSpan = right - left;
                    if (wSpan < Math.min(w, h) * 0.1) continue;

                    for (const top of hClusters) {
                        const hByRatio = wSpan / CARD_RATIO;
                        const wByRatio = wSpan * CARD_RATIO;

                        for (const expectedH of [hByRatio, wByRatio]) {
                            const bottom = top + expectedH;
                            if (bottom > 0 && bottom < h * 1.05) {
                                const pts = [[left, top], [right, top], [right, bottom], [left, bottom]];
                                const score = this._scoreCandidate(pts, srcImg);
                                if (score > 0) {
                                    candidates.push({ corners: this._orderPoints(pts), score: score });
                                }
                            }
                        }
                    }
                }
            }
        }

        if (candidates.length === 0) return null;
        candidates.sort((a, b) => b.score - a.score);
        return candidates[0];
    }

    /**
     * Cluster nearby values together. Returns array of cluster centers.
     */
    _clusterValues(values, threshold) {
        if (values.length === 0) return [];
        const sorted = [...values].sort((a, b) => a - b);
        const clusters = [];
        let clusterStart = sorted[0];
        let clusterSum = sorted[0];
        let clusterCount = 1;

        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] - clusterStart < threshold) {
                clusterSum += sorted[i];
                clusterCount++;
            } else {
                clusters.push(clusterSum / clusterCount);
                clusterStart = sorted[i];
                clusterSum = sorted[i];
                clusterCount = 1;
            }
        }
        clusters.push(clusterSum / clusterCount);
        return clusters;
    }

    /**
     * Select the most card-like connected component from eroded mask,
     * then recover its full extent from the original mask.
     */
    _selectCardComponent(erodedMask, originalMask, w, h) {
        const labels = new cv.Mat();
        const stats = new cv.Mat();
        const centroids = new cv.Mat();
        const numLabels = cv.connectedComponentsWithStats(erodedMask, labels, stats, centroids);

        if (numLabels <= 1) {
            labels.delete(); stats.delete(); centroids.delete();
            const result = new cv.Mat();
            originalMask.copyTo(result);
            return result;
        }

        let bestLabel = -1;
        let bestScore = -1;
        const imgArea = w * h;

        for (let i = 1; i < numLabels; i++) {
            const compArea = stats.intAt(i, cv.CC_STAT_AREA);
            const compW = stats.intAt(i, cv.CC_STAT_WIDTH);
            const compH = stats.intAt(i, cv.CC_STAT_HEIGHT);

            if (compArea < imgArea * 0.03) continue;

            const ratio = Math.max(compW, compH) / Math.max(1, Math.min(compW, compH));
            const ratioDiff = Math.abs(ratio - 1.585);
            const compactness = compArea / (compW * compH);

            let score = 0;
            if (ratioDiff < 0.15) score += 30;
            else if (ratioDiff < 0.3) score += 20;
            else if (ratioDiff < 0.5) score += 10;
            else score -= 10;

            if (compactness > 0.6) score += 15;
            else if (compactness > 0.4) score += 10;

            score += Math.min(20, (compArea / imgArea) * 100);

            if (score > bestScore) {
                bestScore = score;
                bestLabel = i;
            }
        }

        if (bestLabel < 0) {
            labels.delete(); stats.delete(); centroids.delete();
            const result = new cv.Mat();
            originalMask.copyTo(result);
            return result;
        }

        const componentMask = new cv.Mat(h, w, cv.CV_8UC1, new cv.Scalar(0));
        const lx = stats.intAt(bestLabel, cv.CC_STAT_LEFT);
        const ly = stats.intAt(bestLabel, cv.CC_STAT_TOP);
        const lw = stats.intAt(bestLabel, cv.CC_STAT_WIDTH);
        const lh = stats.intAt(bestLabel, cv.CC_STAT_HEIGHT);

        const margin = Math.round(Math.min(w, h) / 40);
        const rx1 = Math.max(0, lx - margin);
        const ry1 = Math.max(0, ly - margin);
        const rx2 = Math.min(w, lx + lw + margin);
        const ry2 = Math.min(h, ly + lh + margin);

        for (let y = ry1; y < ry2; y++) {
            for (let x = rx1; x < rx2; x++) {
                if (originalMask.ucharAt(y, x) > 0) {
                    componentMask.data[y * w + x] = 255;
                }
            }
        }

        labels.delete(); stats.delete(); centroids.delete();
        return componentMask;
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
     * Async detection that prioritizes the ONNX model.
     * Model is more robust for complex backgrounds, hands, etc.
     * Falls back to CV-based detection if model unavailable or fails.
     */
    async detectAsync(imageData, width, height) {
        // Try model-based detection first (more robust)
        if (this.modelReady) {
            const src = cv.matFromImageData(imageData);
            try {
                const modelResult = await this._strategyModel(src);
                if (modelResult && modelResult.score >= 15) {
                    modelResult.method = 'model';
                    return modelResult;
                }
            } catch (e) {
                console.warn('Model detection failed, falling back to CV:', e.message);
            } finally {
                src.delete();
            }
        }

        // Fallback to CV-based detection
        return this.detect(imageData, width, height);
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

            // Try both raw contour and convex hull
            const hull = new cv.Mat();
            cv.convexHull(cnt, hull);
            const sources = [cnt, hull];

            for (const source of sources) {
                const peri = cv.arcLength(source, true);

                // Try approxPolyDP with various epsilon
                for (const epsMult of [0.015, 0.02, 0.025, 0.03, 0.04, 0.05, 0.06]) {
                    const approx = new cv.Mat();
                    cv.approxPolyDP(source, approx, epsMult * peri, true);

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
            }

            // Try minAreaRect on convex hull as fallback
            if (info.area > minArea * 1.5) {
                const rect = cv.minAreaRect(hull);
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

            hull.delete();
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
        if (areaRatio < 0.03 || areaRatio > 0.95) return -1;
        // Area is the most important signal - larger candidates are more likely to be the full card
        if (areaRatio >= 0.15 && areaRatio <= 0.70) score += 25;
        else if (areaRatio >= 0.10 && areaRatio <= 0.80) score += 18;
        else if (areaRatio >= 0.07) score += 10;
        else score -= 5;

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

            if (avgBrightness > 160) score += 10;
            else if (avgBrightness > 130) score += 8;
            else if (avgBrightness > 100) score += 5;
            else if (avgBrightness < 80) score -= 5;

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
     * Load orientation classification model (PP-LCNet_x1_0_doc_ori).
     * Classifies document orientation: 0°, 90°, 180°, 270°.
     */
    async loadOrientationModel(modelUrl) {
        try {
            this.oriModel = await ort.InferenceSession.create(modelUrl, {
                executionProviders: ['wasm'],
            });
            this.oriModelReady = true;
            console.log('Orientation model loaded successfully');
            return true;
        } catch (e) {
            console.warn('Failed to load orientation model:', e.message);
            this.oriModelReady = false;
            return false;
        }
    }

    /**
     * Detect orientation using PP-LCNet model.
     * Returns rotation angle: 0, 90, 180, or 270.
     */
    async detectOrientationAsync(imageData, width, height) {
        if (this.oriModelReady) {
            try {
                return await this._orientationModel(imageData, width, height);
            } catch (e) {
                console.warn('Orientation model failed, falling back to heuristic:', e.message);
            }
        }
        return 0; // Default: no rotation
    }

    /**
     * Run PP-LCNet orientation model on image data.
     * Preprocessing: resize short→256, center crop 224, ImageNet normalize, CHW.
     */
    async _orientationModel(imageData, width, height) {
        const size = 224;

        // Step 1: Resize short side to 256 using canvas
        const shortSide = Math.min(width, height);
        const scale = 256.0 / shortSide;
        const newW = Math.round(width * scale);
        const newH = Math.round(height * scale);

        const resizeCanvas = document.createElement('canvas');
        resizeCanvas.width = newW;
        resizeCanvas.height = newH;
        const resizeCtx = resizeCanvas.getContext('2d');

        // Draw imageData to temp canvas first
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = width;
        tmpCanvas.height = height;
        tmpCanvas.getContext('2d').putImageData(imageData, 0, 0);
        resizeCtx.drawImage(tmpCanvas, 0, 0, newW, newH);

        // Step 2: Center crop to 224x224
        const left = Math.floor((newW - size) / 2);
        const top = Math.floor((newH - size) / 2);
        const cropData = resizeCtx.getImageData(left, top, size, size);

        // Step 3: Normalize with ImageNet stats and convert to CHW
        const mean = [0.485, 0.456, 0.406];
        const std = [0.229, 0.224, 0.225];
        const inputData = new Float32Array(3 * size * size);
        const data = cropData.data;
        for (let i = 0; i < size * size; i++) {
            inputData[i] = (data[i * 4] / 255.0 - mean[0]) / std[0];                     // R
            inputData[size * size + i] = (data[i * 4 + 1] / 255.0 - mean[1]) / std[1];   // G
            inputData[2 * size * size + i] = (data[i * 4 + 2] / 255.0 - mean[2]) / std[2]; // B
        }

        // Run inference
        const tensor = new ort.Tensor('float32', inputData, [1, 3, size, size]);
        const results = await this.oriModel.run({ x: tensor });
        const output = results[Object.keys(results)[0]].data;

        // Check if output is already probabilities (sum ~1, all in [0,1])
        let probs;
        const outputArr = Array.from(output);
        const allPositive = outputArr.every(v => v >= 0 && v <= 1);
        const sumClose1 = Math.abs(outputArr.reduce((a, b) => a + b, 0) - 1.0) < 0.1;
        if (allPositive && sumClose1) {
            probs = outputArr;
        } else {
            // Apply softmax for raw logits
            const maxVal = Math.max(...outputArr);
            const expVals = outputArr.map(v => Math.exp(v - maxVal));
            const sumExp = expVals.reduce((a, b) => a + b, 0);
            probs = expVals.map(v => v / sumExp);
        }

        // Labels: [0°, 90°, 180°, 270°]
        const angles = [0, 90, 180, 270];
        const predIdx = probs.indexOf(Math.max(...probs));
        const confidence = probs[predIdx];
        const angle = angles[predIdx];

        console.log(`Orientation model: ${angle}° (conf=${confidence.toFixed(3)}) raw=[${outputArr.map(v => v.toFixed(3)).join(',')}]`);
        return angle;
    }
}

// Global instance
const detector = new IDCardDetector();
