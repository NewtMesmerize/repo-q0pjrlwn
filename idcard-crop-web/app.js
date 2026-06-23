/**
 * ID Card Crop Web App - Main Application Logic
 */

// State
const state = {
    images: [],        // { file, img, imageData, corners, result, status }
    currentIndex: 0,
    cvReady: false,
    dragging: null,    // { cornerIndex, startX, startY }
};

// DOM Elements
const els = {
    uploadArea: null,
    fileInput: null,
    statusBar: null,
    statusText: null,
    progressFill: null,
    workspace: null,
    batchNav: null,
    batchCounter: null,
    sourceCanvas: null,
    sourceContainer: null,
    resultCanvas: null,
    overlaySvg: null,
    cornerPolygon: null,
    cornerHandles: [],
    detectionBadge: null,
    loadingOverlay: null,
    loadingText: null,
    resultsList: null,
    resultsGrid: null,
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initEventListeners();
});

function initElements() {
    els.uploadArea = document.getElementById('upload-area');
    els.fileInput = document.getElementById('file-input');
    els.statusBar = document.getElementById('status-bar');
    els.statusText = document.getElementById('status-text');
    els.progressFill = document.getElementById('progress-fill');
    els.workspace = document.getElementById('workspace');
    els.batchNav = document.getElementById('batch-nav');
    els.batchCounter = document.getElementById('batch-counter');
    els.sourceCanvas = document.getElementById('source-canvas');
    els.sourceContainer = document.getElementById('source-container');
    els.resultCanvas = document.getElementById('result-canvas');
    els.overlaySvg = document.getElementById('overlay-svg');
    els.cornerPolygon = document.getElementById('corner-polygon');
    els.cornerHandles = [
        document.getElementById('corner-tl'),
        document.getElementById('corner-tr'),
        document.getElementById('corner-br'),
        document.getElementById('corner-bl'),
    ];
    els.detectionBadge = document.getElementById('detection-badge');
    els.loadingOverlay = document.getElementById('loading-overlay');
    els.loadingText = document.getElementById('loading-text');
    els.resultsList = document.getElementById('results-list');
    els.resultsGrid = document.getElementById('results-grid');
}

function initEventListeners() {
    // Upload
    els.uploadArea.addEventListener('click', () => els.fileInput.click());
    els.fileInput.addEventListener('change', handleFiles);
    els.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        els.uploadArea.classList.add('dragover');
    });
    els.uploadArea.addEventListener('dragleave', () => {
        els.uploadArea.classList.remove('dragover');
    });
    els.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        els.uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFileList(e.dataTransfer.files);
        }
    });

    // Buttons
    document.getElementById('btn-prev').addEventListener('click', () => navigate(-1));
    document.getElementById('btn-next').addEventListener('click', () => navigate(1));
    document.getElementById('btn-auto-detect').addEventListener('click', redetect);
    document.getElementById('btn-reset-corners').addEventListener('click', resetCorners);
    document.getElementById('btn-rotate-cw').addEventListener('click', () => rotateResult(90));
    document.getElementById('btn-rotate-180').addEventListener('click', () => rotateResult(180));
    document.getElementById('btn-crop').addEventListener('click', cropCurrent);
    document.getElementById('btn-download').addEventListener('click', downloadCurrent);
    document.getElementById('btn-download-all').addEventListener('click', downloadAll);
    document.getElementById('btn-clear').addEventListener('click', clearAll);

    // Corner dragging
    els.cornerHandles.forEach((handle, idx) => {
        handle.addEventListener('mousedown', (e) => startDrag(e, idx));
        handle.addEventListener('touchstart', (e) => startDrag(e, idx), { passive: false });
    });
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
}

// OpenCV ready callback (called from HTML)
function onOpenCVReady() {
    cv['onRuntimeInitialized'] = () => {
        state.cvReady = true;
        detector.setCVReady();
        els.loadingOverlay.classList.add('hidden');
        console.log('OpenCV.js ready');
    };

    // If cv is already ready
    if (cv.Mat) {
        state.cvReady = true;
        detector.setCVReady();
        els.loadingOverlay.classList.add('hidden');
    }
}

// File handling
function handleFiles(e) {
    handleFileList(e.target.files);
}

function handleFileList(files) {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    state.images = [];
    state.currentIndex = 0;

    els.uploadArea.classList.add('hidden');
    els.statusBar.classList.remove('hidden');
    els.statusText.textContent = `正在处理 ${imageFiles.length} 张图片...`;
    els.progressFill.style.width = '0%';

    processImages(imageFiles);
}

async function processImages(files) {
    for (let i = 0; i < files.length; i++) {
        els.statusText.textContent = `正在处理第 ${i + 1}/${files.length} 张...`;
        els.progressFill.style.width = `${((i + 1) / files.length) * 100}%`;

        const img = await loadImage(files[i]);
        const imageData = getImageData(img);

        // Detect corners (try async model-based first, then CV)
        let corners = null;
        let method = 'manual';
        let score = 0;

        if (state.cvReady) {
            const result = detector.modelReady
                ? await detector.detectAsync(imageData, imageData.width, imageData.height)
                : detector.detect(imageData, imageData.width, imageData.height);
            if (result) {
                corners = result.corners;
                method = result.method;
                score = result.score;
            }
        }

        // If no detection, set default corners (image edges with margin)
        if (!corners) {
            const margin = 0.1;
            corners = [
                [img.width * margin, img.height * margin],
                [img.width * (1 - margin), img.height * margin],
                [img.width * (1 - margin), img.height * (1 - margin)],
                [img.width * margin, img.height * (1 - margin)],
            ];
        }

        // Generate initial crop
        let resultData = null;
        if (state.cvReady) {
            resultData = detector.perspectiveCrop(imageData, corners);

            // Fix orientation
            if (resultData) {
                const rotation = detector.detectOrientation(resultData, 856, 540);
                if (rotation === 180) {
                    resultData = rotateImageData(resultData, 180);
                }
            }
        }

        state.images.push({
            file: files[i],
            img: img,
            imageData: imageData,
            corners: corners,
            result: resultData,
            method: method,
            score: score,
            rotation: 0,
        });

        // Small delay to keep UI responsive
        await new Promise(r => setTimeout(r, 10));
    }

    // Show workspace
    els.statusBar.classList.add('hidden');
    els.workspace.classList.remove('hidden');
    showImage(0);

    if (state.images.length > 1) {
        els.resultsList.classList.remove('hidden');
        updateResultsGrid();
    }
}

function loadImage(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(file);
    });
}

function getImageData(img) {
    const canvas = document.createElement('canvas');
    // Limit size for performance
    const maxDim = 1500;
    let w = img.width, h = img.height;
    if (Math.max(w, h) > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
}

// Display
function showImage(index) {
    if (index < 0 || index >= state.images.length) return;
    state.currentIndex = index;

    const item = state.images[index];

    // Update source canvas
    const srcCtx = els.sourceCanvas.getContext('2d');
    els.sourceCanvas.width = item.imageData.width;
    els.sourceCanvas.height = item.imageData.height;
    srcCtx.putImageData(item.imageData, 0, 0);

    // Update corners display
    updateCornersDisplay();

    // Update result canvas
    if (item.result) {
        const resCtx = els.resultCanvas.getContext('2d');
        els.resultCanvas.width = item.result.width;
        els.resultCanvas.height = item.result.height;
        resCtx.putImageData(item.result, 0, 0);
    }

    // Update badge
    if (item.method.startsWith('auto')) {
        els.detectionBadge.textContent = '自动检测';
        els.detectionBadge.className = 'detection-badge auto';
    } else if (item.method === 'model') {
        els.detectionBadge.textContent = '模型检测';
        els.detectionBadge.className = 'detection-badge model';
    } else {
        els.detectionBadge.textContent = '手动调整';
        els.detectionBadge.className = 'detection-badge manual';
    }

    // Update batch counter
    els.batchCounter.textContent = `${index + 1} / ${state.images.length}`;
    document.getElementById('btn-prev').disabled = index === 0;
    document.getElementById('btn-next').disabled = index === state.images.length - 1;
}

function updateCornersDisplay() {
    const item = state.images[state.currentIndex];
    if (!item) return;

    const canvas = els.sourceCanvas;
    const container = els.sourceContainer;
    const rect = canvas.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate scale between canvas internal size and display size
    const scaleX = rect.width / canvas.width;
    const scaleY = rect.height / canvas.height;
    const offsetX = rect.left - containerRect.left;
    const offsetY = rect.top - containerRect.top;

    // Update handle positions
    const points = [];
    item.corners.forEach((corner, i) => {
        const x = corner[0] * scaleX + offsetX;
        const y = corner[1] * scaleY + offsetY;
        els.cornerHandles[i].style.left = `${x}px`;
        els.cornerHandles[i].style.top = `${y}px`;
        points.push(`${x},${y}`);
    });

    // Update SVG polygon
    els.cornerPolygon.setAttribute('points', points.join(' '));
}

// Corner dragging
function startDrag(e, cornerIndex) {
    e.preventDefault();
    state.dragging = { cornerIndex };
}

function onDrag(e) {
    if (!state.dragging) return;
    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    const canvas = els.sourceCanvas;
    const rect = canvas.getBoundingClientRect();

    // Get position relative to canvas
    const x = (touch.clientX - rect.left) / rect.width * canvas.width;
    const y = (touch.clientY - rect.top) / rect.height * canvas.height;

    // Clamp to canvas bounds
    const clampedX = Math.max(0, Math.min(canvas.width, x));
    const clampedY = Math.max(0, Math.min(canvas.height, y));

    // Update corner
    const item = state.images[state.currentIndex];
    item.corners[state.dragging.cornerIndex] = [clampedX, clampedY];
    item.method = 'manual';

    updateCornersDisplay();
}

function endDrag() {
    if (state.dragging) {
        state.dragging = null;
        // Re-crop with new corners
        cropCurrent();
    }
}

// Actions
function navigate(direction) {
    showImage(state.currentIndex + direction);
}

function redetect() {
    const item = state.images[state.currentIndex];
    if (!state.cvReady) return;

    const result = detector.detect(item.imageData, item.imageData.width, item.imageData.height);
    if (result) {
        item.corners = result.corners;
        item.method = result.method;
        item.score = result.score;
        updateCornersDisplay();
        cropCurrent();
    } else {
        alert('自动检测失败，请手动调整角点');
    }
}

function resetCorners() {
    const item = state.images[state.currentIndex];
    const w = item.imageData.width;
    const h = item.imageData.height;
    const margin = 0.1;
    item.corners = [
        [w * margin, h * margin],
        [w * (1 - margin), h * margin],
        [w * (1 - margin), h * (1 - margin)],
        [w * margin, h * (1 - margin)],
    ];
    item.method = 'manual';
    updateCornersDisplay();
    cropCurrent();
}

function cropCurrent() {
    const item = state.images[state.currentIndex];
    if (!state.cvReady) return;

    item.result = detector.perspectiveCrop(item.imageData, item.corners);

    if (item.result) {
        // Auto orientation fix
        const rotation = detector.detectOrientation(item.result, item.result.width, item.result.height);
        if (rotation === 180) {
            item.result = rotateImageData(item.result, 180);
        }

        const resCtx = els.resultCanvas.getContext('2d');
        els.resultCanvas.width = item.result.width;
        els.resultCanvas.height = item.result.height;
        resCtx.putImageData(item.result, 0, 0);
    }

    updateResultsGrid();
}

function rotateResult(angle) {
    const item = state.images[state.currentIndex];
    if (!item.result) return;

    item.result = rotateImageData(item.result, angle);
    item.rotation = (item.rotation + angle) % 360;

    const resCtx = els.resultCanvas.getContext('2d');
    els.resultCanvas.width = item.result.width;
    els.resultCanvas.height = item.result.height;
    resCtx.putImageData(item.result, 0, 0);
}

function rotateImageData(imageData, angle) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Put original data on temp canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    tempCanvas.getContext('2d').putImageData(imageData, 0, 0);

    if (angle === 90 || angle === 270) {
        canvas.width = imageData.height;
        canvas.height = imageData.width;
    } else {
        canvas.width = imageData.width;
        canvas.height = imageData.height;
    }

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(tempCanvas, -imageData.width / 2, -imageData.height / 2);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function downloadCurrent() {
    const item = state.images[state.currentIndex];
    if (!item.result) return;

    const canvas = document.createElement('canvas');
    canvas.width = item.result.width;
    canvas.height = item.result.height;
    canvas.getContext('2d').putImageData(item.result, 0, 0);

    const link = document.createElement('a');
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    link.download = `${baseName}_cropped.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

async function downloadAll() {
    if (state.images.length === 0) return;

    if (state.images.length === 1) {
        downloadCurrent();
        return;
    }

    // Use JSZip for batch download
    if (typeof JSZip === 'undefined') {
        alert('JSZip 未加载，请刷新页面重试');
        return;
    }

    const zip = new JSZip();

    for (let i = 0; i < state.images.length; i++) {
        const item = state.images[i];
        if (!item.result) continue;

        const canvas = document.createElement('canvas');
        canvas.width = item.result.width;
        canvas.height = item.result.height;
        canvas.getContext('2d').putImageData(item.result, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const base64 = dataUrl.split(',')[1];
        const baseName = item.file.name.replace(/\.[^.]+$/, '');
        zip.file(`${baseName}_cropped.jpg`, base64, { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.download = '身份证裁剪结果.zip';
    link.href = URL.createObjectURL(blob);
    link.click();
}

function clearAll() {
    state.images = [];
    state.currentIndex = 0;
    els.workspace.classList.add('hidden');
    els.resultsList.classList.add('hidden');
    els.uploadArea.classList.remove('hidden');
    els.fileInput.value = '';
}

function updateResultsGrid() {
    if (state.images.length <= 1) return;

    els.resultsGrid.innerHTML = '';
    state.images.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.onclick = () => showImage(i);

        if (item.result) {
            const canvas = document.createElement('canvas');
            canvas.width = item.result.width;
            canvas.height = item.result.height;
            canvas.getContext('2d').putImageData(item.result, 0, 0);

            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/jpeg', 0.7);
            card.appendChild(img);
        }

        const info = document.createElement('div');
        info.className = 'card-info';
        const statusClass = item.method.startsWith('auto') ? 'success' : 'manual';
        const statusText = item.method.startsWith('auto') ? '自动' : '手动';
        info.innerHTML = `
            <span class="card-status ${statusClass}">${statusText}</span>
            ${item.file.name.substring(0, 15)}
        `;
        card.appendChild(info);

        els.resultsGrid.appendChild(card);
    });
}

// Handle window resize for corner positions
window.addEventListener('resize', () => {
    if (state.images.length > 0) {
        setTimeout(updateCornersDisplay, 100);
    }
});

// Also update corners after canvas renders
const resizeObserver = new ResizeObserver(() => {
    if (state.images.length > 0) {
        updateCornersDisplay();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('source-container');
    if (container) resizeObserver.observe(container);
});
