const imageUpload = document.querySelector("#imageUpload");
const pickImageButton = document.querySelector("#pickImageButton");
const imageAddressForm = document.querySelector("#imageAddressForm");
const imageAddressInput = document.querySelector("#imageAddress");
const loadImageAddressButton = document.querySelector("#loadImageAddressButton");
const uploadDropzone = document.querySelector("#uploadDropzone");
const uploadName = document.querySelector("#uploadName");
const pixelWidthInput = document.querySelector("#pixelWidth");
const pixelHeightInput = document.querySelector("#pixelHeight");
const pixelSizeInput = document.querySelector("#pixelSize");
const pixelSizeNumberInput = document.querySelector("#pixelSizeNumber");
const pixelSizeValue = document.querySelector("#pixelSizeValue");
const keepAspectButton = document.querySelector("#keepAspect");
const toggleAntialiasingButton = document.querySelector("#toggleAntialiasing");
const fitSourceButton = document.querySelector("#fitSource");
const previewCoords = document.querySelector("#previewCoords");
const previewCoordsAlt = document.querySelector("#previewCoordsAlt");
const previewHex = document.querySelector("#previewHex");
const previewRgb = document.querySelector("#previewRgb");
const previewHsv = document.querySelector("#previewHsv");
const compareDelta = document.querySelector("#compareDelta");
const copyButtons = Array.from(document.querySelectorAll(".preview-copy-button"));
const colorKeepPanel = document.querySelector("#colorKeepPanel");
const colorKeepStatus = document.querySelector("#colorKeepStatus");
const colorToleranceInput = document.querySelector("#colorTolerance");
const colorToleranceValue = document.querySelector("#colorToleranceValue");
const toggleColorKeepButton = document.querySelector("#toggleColorKeep");
const downloadColorKeepButton = document.querySelector("#downloadColorKeep");
const resetColorKeepButton = document.querySelector("#resetColorKeep");
const viewerFrame = document.querySelector("#viewerFrame");
const emptyState = document.querySelector("#emptyState");
const emptyStateBadge = document.querySelector("#emptyStateBadge");
const emptyStateTitle = document.querySelector("#emptyStateTitle");
const emptyStateBody = document.querySelector("#emptyStateBody");

const pixelCanvas = document.querySelector("#pixelCanvas");
const pixelContext = pixelCanvas.getContext("2d");
const swatchCanvas = document.querySelector("#swatchCanvas");
const swatchContext = swatchCanvas.getContext("2d");

const sourceCanvas = document.createElement("canvas");
const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
const MAX_DIMENSION = 2048;
const DEFAULT_PREVIEW_DIMENSION = 64;
const BOSTON_DYNAMICS_FALLBACK_ADDRESS =
  window.BOSTON_DYNAMICS_IMAGE_DATA_URL || "./boston-dynamics-image.png";
const IMAGE_ADDRESS_FALLBACKS = new Map([
  [
    "https://support.bostondynamics.com/servlet/rtaImage?eid=ka0US0000008Zv5&feoid=00N6g00000RYCWq&refid=0EMUS00000NRV11",
    BOSTON_DYNAMICS_FALLBACK_ADDRESS,
  ],
]);
const IMAGE_ADDRESS_FALLBACK_LABELS = new Map([
  [BOSTON_DYNAMICS_FALLBACK_ADDRESS, "boston-dynamics-image.png"],
]);

let sourceImage = null;
let sampledPixels = null;
let lockAspectRatio = true;
let sourceAspectRatio = 1;
let resizeObserver = null;
let selectedPixel = null;
let secondaryPixel = null;
let renderQueued = false;
let pendingResample = false;
let antialiasingEnabled = false;
let autoScaleEnabled = true;
let dropzoneDragDepth = 0;
let imageLoadRequestId = 0;
let sourceImageFallbackAddress = "";
let sourceImageName = "image";
let colorKeepEnabled = false;
let colorTolerance = 0;

pixelContext.imageSmoothingEnabled = false;
swatchContext.imageSmoothingEnabled = false;
sourceContext.imageSmoothingEnabled = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getDimensionLimit(axis) {
  if (!sourceImage) {
    return MAX_DIMENSION;
  }

  return axis === "width" ? sourceImage.width : sourceImage.height;
}

function syncDimensionLimits() {
  pixelWidthInput.max = String(getDimensionLimit("width"));
  pixelHeightInput.max = String(getDimensionLimit("height"));
}

function getDefaultResolution(width, height) {
  const longestSide = Math.max(width, height);

  if (longestSide <= DEFAULT_PREVIEW_DIMENSION) {
    return { width, height };
  }

  const scale = DEFAULT_PREVIEW_DIMENSION / longestSide;

  return {
    width: clamp(Math.round(width * scale), 1, MAX_DIMENSION),
    height: clamp(Math.round(height * scale), 1, MAX_DIMENSION),
  };
}

function rgbaToHex(r, g, b, a) {
  const alpha = Math.round((a / 255) * 100) / 100;
  const hex = [r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
  return { hex: `#${hex}`, alpha };
}

function rgbToHsv(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) {
    hue += 360;
  }

  const saturation = max === 0 ? 0 : Math.round((delta / max) * 100);
  const value = Math.round(max * 100);
  return { h: hue, s: saturation, v: value };
}

function updatePixelSizeLabel() {
  const pixelSize = Number(pixelSizeInput.value);
  pixelSizeNumberInput.value = pixelSize.toFixed(1);
  pixelSizeValue.textContent = `${pixelSize.toFixed(1)}px`;
}

function syncPixelSizeRange(value) {
  const minScale = Number(pixelSizeInput.min) || 0.1;
  const safeValue = Math.max(Number(value) || minScale, minScale);
  const currentMax = Number(pixelSizeInput.max) || safeValue;

  if (safeValue > currentMax) {
    pixelSizeInput.max = String(Math.ceil(safeValue));
  }
}

function getAutoPixelSize(width, height) {
  const minScale = Number(pixelSizeInput.min);
  const step = Number(pixelSizeInput.step) || 1;
  const frameStyle = window.getComputedStyle(viewerFrame);
  const horizontalPadding =
    Number.parseFloat(frameStyle.paddingLeft) + Number.parseFloat(frameStyle.paddingRight);
  const verticalPadding =
    Number.parseFloat(frameStyle.paddingTop) + Number.parseFloat(frameStyle.paddingBottom);
  const availableWidth = Math.max(1, viewerFrame.clientWidth - horizontalPadding);
  const availableHeight = Math.max(1, viewerFrame.clientHeight - verticalPadding);
  const rawScale = Math.min(availableWidth / width, availableHeight / height);
  const fittedScale = Math.floor(rawScale / step) * step;

  return Math.max(fittedScale || minScale, minScale);
}

function fitDisplayScale(force = false) {
  if (!sourceImage || (!force && !autoScaleEnabled)) {
    return;
  }

  const width = clamp(Number(pixelWidthInput.value) || 1, 1, getDimensionLimit("width"));
  const height = clamp(Number(pixelHeightInput.value) || 1, 1, getDimensionLimit("height"));
  const autoPixelSize = getAutoPixelSize(width, height);
  syncPixelSizeRange(autoPixelSize);
  pixelSizeInput.value = autoPixelSize;
  updatePixelSizeLabel();
}

function setPixelSize(value) {
  const minScale = Number(pixelSizeInput.min) || 0.1;
  const nextValue = Math.max(Number(value) || minScale, minScale);
  syncPixelSizeRange(nextValue);
  pixelSizeInput.value = String(nextValue);
  updatePixelSizeLabel();
  autoScaleEnabled = false;
}

function setUploadName(name) {
  uploadName.textContent = name;
}

function setEmptyStateContent(badge, title, body) {
  emptyStateBadge.textContent = badge;
  emptyStateTitle.textContent = title;
  emptyStateBody.textContent = body;
}

function setDropzoneActive(active) {
  uploadDropzone.classList.toggle("is-drag-active", active);
}

function updateAspectLockLabel() {
  keepAspectButton.textContent = `Lock aspect ratio: ${lockAspectRatio ? "On" : "Off"}`;
}

function updateAntialiasingLabel() {
  toggleAntialiasingButton.textContent = `Anti-aliasing: ${antialiasingEnabled ? "On" : "Off"}`;
  pixelCanvas.classList.toggle("is-antialiased", antialiasingEnabled);
}

function setPreviewCopyState(element, text = "") {
  element.dataset.copyValue = text;
  const button = document.querySelector(`[data-copy-target="${element.id}"]`);

  if (!button) {
    return;
  }

  button.disabled = !text;
  button.textContent = "Copy";
}

function getPixelDetails(pixelX, pixelY) {
  const width = sampledPixels.width;
  const displayY = sampledPixels.height - 1 - pixelY;
  const index = (pixelY * width + pixelX) * 4;
  const { data } = sampledPixels;
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const a = data[index + 3];
  const { hex } = rgbaToHex(r, g, b, a);
  const hsv = rgbToHsv(r, g, b);

  return {
    x: pixelX,
    y: pixelY,
    displayY,
    r,
    g,
    b,
    a,
    hex,
    hsv,
    rgbValue: `rgb(${r}, ${g}, ${b})`,
    hsvValue: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
  };
}

function formatSigned(value) {
  if (value === 0) {
    return "0";
  }

  return `${value > 0 ? "+" : ""}${value}`;
}

function updateComparisonReadout() {
  const primary = selectedPixel ? getPixelDetails(selectedPixel.x, selectedPixel.y) : null;
  const secondary = secondaryPixel ? getPixelDetails(secondaryPixel.x, secondaryPixel.y) : null;

  if (!primary || !secondary) {
    compareDelta.textContent = primary
      ? "offset from origin: set point B with right click"
      : "offset from origin: select point A first";
    return;
  }

  const deltaX = secondary.x - primary.x;
  const deltaY = secondary.displayY - primary.displayY;

  compareDelta.textContent = `offset from origin: ${formatSigned(deltaX)} x, ${formatSigned(deltaY)} y`;
}

function grayscaleValue(r, g, b) {
  return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
}

function createColorKeptPixels(imageData, selectedColor, tolerance) {
  const output = new Uint8ClampedArray(imageData.data);
  const allowedDistance = (clamp(tolerance, 0, 100) / 100) * Math.sqrt(3 * 255 ** 2);
  const allowedDistanceSquared = allowedDistance ** 2;

  for (let index = 0; index < output.length; index += 4) {
    const redDifference = imageData.data[index] - selectedColor.r;
    const greenDifference = imageData.data[index + 1] - selectedColor.g;
    const blueDifference = imageData.data[index + 2] - selectedColor.b;
    const distanceSquared =
      redDifference ** 2 + greenDifference ** 2 + blueDifference ** 2;

    if (distanceSquared > allowedDistanceSquared) {
      const gray = grayscaleValue(
        imageData.data[index],
        imageData.data[index + 1],
        imageData.data[index + 2]
      );
      output[index] = gray;
      output[index + 1] = gray;
      output[index + 2] = gray;
    }
  }

  return new ImageData(output, imageData.width, imageData.height);
}

function getColorKeepImageData() {
  if (!sampledPixels || !selectedPixel) {
    return null;
  }

  return createColorKeptPixels(
    sampledPixels,
    getPixelDetails(selectedPixel.x, selectedPixel.y),
    colorTolerance
  );
}

function updateColorKeepControls() {
  const hasSelectedColor = Boolean(sampledPixels && selectedPixel);
  const details = hasSelectedColor
    ? getPixelDetails(selectedPixel.x, selectedPixel.y)
    : null;

  colorToleranceInput.disabled = !hasSelectedColor;
  toggleColorKeepButton.disabled = !hasSelectedColor;
  downloadColorKeepButton.disabled = !hasSelectedColor;
  resetColorKeepButton.disabled = !hasSelectedColor || (!colorKeepEnabled && colorTolerance === 0);
  colorToleranceInput.value = String(colorTolerance);
  colorToleranceValue.textContent = colorTolerance === 0 ? "Exact" : `${colorTolerance}%`;
  toggleColorKeepButton.textContent = colorKeepEnabled ? "Show original" : "Preview effect";
  toggleColorKeepButton.setAttribute("aria-pressed", String(colorKeepEnabled));
  colorKeepPanel.classList.toggle("is-active", colorKeepEnabled && hasSelectedColor);

  if (!details) {
    colorKeepStatus.textContent = "Pick point A";
  } else if (colorKeepEnabled) {
    colorKeepStatus.textContent = `Keeping ${details.hex}`;
  } else {
    colorKeepStatus.textContent = `Ready ${details.hex}`;
  }
}

function resetColorKeep() {
  colorKeepEnabled = false;
  colorTolerance = 0;
  updateColorKeepControls();
}

function resetHoverState() {
  selectedPixel = null;
  secondaryPixel = null;
  previewCoords.textContent = "origin: -";
  previewCoordsAlt.textContent = "point B: -";
  previewHex.textContent = "hex: -";
  previewRgb.textContent = "rgb: -";
  previewHsv.textContent = "hsv: -";
  setPreviewCopyState(previewHex);
  setPreviewCopyState(previewRgb);
  setPreviewCopyState(previewHsv);
  updateComparisonReadout();
  swatchContext.clearRect(0, 0, swatchCanvas.width, swatchCanvas.height);
  resetColorKeep();
}

function resetViewer(message = "No image yet") {
  sampledPixels = null;
  sourceImage = null;
  showImageState(false);
  setEmptyStateContent("No image loaded", "Drop an image and inspect every pixel.", message);
  resetHoverState();
}

function showImageState(hasImage) {
  viewerFrame.classList.toggle("empty", !hasImage);
  emptyState.hidden = hasImage;
  pixelCanvas.hidden = !hasImage;
}

function sampleImage(width, height) {
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  sourceContext.imageSmoothingEnabled = antialiasingEnabled;
  sourceContext.clearRect(0, 0, width, height);
  sourceContext.drawImage(sourceImage, 0, 0, width, height);

  try {
    sampledPixels = sourceContext.getImageData(0, 0, width, height);
    return true;
  } catch (error) {
    if (sourceImageFallbackAddress) {
      const fallbackAddress = sourceImageFallbackAddress;
      sourceImageFallbackAddress = "";
      loadFallbackImageAddress(fallbackAddress, imageLoadRequestId, true);
      return false;
    }

    sampledPixels = null;
    resetViewer(
      "That image host blocks pixel inspection. Try downloading the image and using Pick image instead."
    );
    setUploadName("Image address blocked");
    return false;
  }
}

function renderPixelCanvas() {
  if (!sourceImage || !sampledPixels) {
    return;
  }

  const width = Number(pixelWidthInput.value);
  const height = Number(pixelHeightInput.value);
  const pixelSize = Number(pixelSizeInput.value);
  const displayWidth = width * pixelSize;
  const displayHeight = height * pixelSize;

  pixelCanvas.width = width;
  pixelCanvas.height = height;
  pixelCanvas.style.width = `${displayWidth}px`;
  pixelCanvas.style.height = `${displayHeight}px`;
  pixelCanvas.style.backgroundSize = [
    `${pixelSize * 2}px ${pixelSize * 2}px`,
    `${pixelSize * 2}px ${pixelSize * 2}px`,
    `${pixelSize}px ${pixelSize}px`,
    `${pixelSize}px ${pixelSize}px`,
  ].join(", ");

  pixelContext.imageSmoothingEnabled = antialiasingEnabled;
  pixelContext.clearRect(0, 0, width, height);
  const colorKeptPixels = colorKeepEnabled ? getColorKeepImageData() : null;

  if (colorKeptPixels) {
    pixelContext.putImageData(colorKeptPixels, 0, 0);
  } else {
    pixelContext.drawImage(sourceCanvas, 0, 0, width, height);
  }

  if (selectedPixel) {
    pixelContext.fillStyle = "rgba(47, 128, 237, 0.38)";
    pixelContext.fillRect(selectedPixel.x, selectedPixel.y, 1, 1);
    pixelContext.strokeStyle = "rgba(22, 76, 168, 0.95)";
    pixelContext.lineWidth = Math.max(0.08, 1 / Math.max(pixelSize, 1));
    pixelContext.strokeRect(
      selectedPixel.x + pixelContext.lineWidth / 2,
      selectedPixel.y + pixelContext.lineWidth / 2,
      1 - pixelContext.lineWidth,
      1 - pixelContext.lineWidth
    );
  }

  if (secondaryPixel) {
    pixelContext.fillStyle = "rgba(219, 111, 69, 0.42)";
    pixelContext.fillRect(secondaryPixel.x, secondaryPixel.y, 1, 1);
    pixelContext.strokeStyle = "rgba(152, 63, 22, 0.95)";
    pixelContext.lineWidth = Math.max(0.08, 1 / Math.max(pixelSize, 1));
    pixelContext.strokeRect(
      secondaryPixel.x + pixelContext.lineWidth / 2,
      secondaryPixel.y + pixelContext.lineWidth / 2,
      1 - pixelContext.lineWidth,
      1 - pixelContext.lineWidth
    );
  }
}

function queueRerender({ resample = false, autoFit = false, forceAutoFit = false } = {}) {
  if (!sourceImage) {
    return;
  }

  pendingResample = pendingResample || resample;

  if (renderQueued) {
    return;
  }

  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;

    syncDimensionLimits();
    const width = clamp(Number(pixelWidthInput.value) || 1, 1, getDimensionLimit("width"));
    const height = clamp(Number(pixelHeightInput.value) || 1, 1, getDimensionLimit("height"));

    pixelWidthInput.value = width;
    pixelHeightInput.value = height;

    if (autoFit) {
      fitDisplayScale(forceAutoFit);
    } else {
      updatePixelSizeLabel();
    }

    if (pendingResample) {
      if (!sampleImage(width, height)) {
        pendingResample = false;
        return;
      }

      if (
        (selectedPixel && (selectedPixel.x >= width || selectedPixel.y >= height)) ||
        (secondaryPixel && (secondaryPixel.x >= width || secondaryPixel.y >= height))
      ) {
        resetHoverState();
      } else {
        updateColorKeepControls();
      }
    }

    pendingResample = false;
    renderPixelCanvas();
  });
}

function syncHeightToWidth() {
  if (!lockAspectRatio || !sourceImage) {
    return;
  }

  const widthLimit = getDimensionLimit("width");
  const newWidth = clamp(Number(pixelWidthInput.value) || 1, 1, widthLimit);
  pixelWidthInput.value = newWidth;
  pixelHeightInput.value = clamp(
    Math.round(Math.min(newWidth, widthLimit) / sourceAspectRatio),
    1,
    getDimensionLimit("height")
  );
}

function syncWidthToHeight() {
  if (!lockAspectRatio || !sourceImage) {
    return;
  }

  const newHeight = clamp(Number(pixelHeightInput.value) || 1, 1, getDimensionLimit("height"));
  pixelHeightInput.value = newHeight;
  pixelWidthInput.value = clamp(Math.round(newHeight * sourceAspectRatio), 1, getDimensionLimit("width"));
}

function rerenderFromInputs() {
  if (!sourceImage) {
    return;
  }
  queueRerender({ resample: true, autoFit: autoScaleEnabled, forceAutoFit: false });
}

function updateSwatch(r, g, b, a) {
  swatchContext.clearRect(0, 0, swatchCanvas.width, swatchCanvas.height);
  swatchContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  swatchContext.fillRect(0, 0, swatchCanvas.width, swatchCanvas.height);
}

async function copyTextValue(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  tempInput.setAttribute("readonly", "");
  tempInput.style.position = "absolute";
  tempInput.style.left = "-9999px";
  document.body.append(tempInput);
  tempInput.select();
  document.execCommand("copy");
  tempInput.remove();
}

async function handleCopyButtonClick(event) {
  const button = event.currentTarget;
  const targetId = button.dataset.copyTarget;
  const target = document.querySelector(`#${targetId}`);
  const copyValue = target?.dataset.copyValue;

  if (!copyValue) {
    return;
  }

  try {
    await copyTextValue(copyValue);
    button.textContent = "Copied";
    window.setTimeout(() => {
      if (!button.disabled) {
        button.textContent = "Copy";
      }
    }, 1400);
  } catch (error) {
    button.textContent = "Failed";
    window.setTimeout(() => {
      if (!button.disabled) {
        button.textContent = "Copy";
      }
    }, 1400);
  }
}

function setHoveredPixel(pixelX, pixelY) {
  if (!sampledPixels) {
    return;
  }

  selectedPixel = { x: pixelX, y: pixelY };
  const details = getPixelDetails(pixelX, pixelY);

  previewCoords.textContent = `origin: ${pixelX}, ${details.displayY}`;
  previewHex.textContent = `hex: ${details.hex}`;
  previewRgb.textContent = `rgb: ${details.r}, ${details.g}, ${details.b}`;
  previewHsv.textContent = `hsv: ${details.hsv.h}, ${details.hsv.s}%, ${details.hsv.v}%`;
  setPreviewCopyState(previewHex, details.hex);
  setPreviewCopyState(previewRgb, details.rgbValue);
  setPreviewCopyState(previewHsv, details.hsvValue);
  updateComparisonReadout();
  updateSwatch(details.r, details.g, details.b, details.a);
  updateColorKeepControls();
  renderPixelCanvas();
}

function downloadColorKeptImage() {
  const colorKeptPixels = getColorKeepImageData();

  if (!colorKeptPixels) {
    return;
  }

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = colorKeptPixels.width;
  exportCanvas.height = colorKeptPixels.height;
  exportCanvas.getContext("2d").putImageData(colorKeptPixels, 0, 0);

  exportCanvas.toBlob((blob) => {
    if (!blob) {
      return;
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const baseName = sourceImageName.replace(/\.[^.]+$/, "") || "image";
    anchor.href = url;
    anchor.download = `${baseName}-color-kept.png`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }, "image/png");
}

function setSecondaryPixel(pixelX, pixelY) {
  if (!sampledPixels) {
    return;
  }

  secondaryPixel = { x: pixelX, y: pixelY };
  const details = getPixelDetails(pixelX, pixelY);
  previewCoordsAlt.textContent = `point B: ${pixelX}, ${details.displayY}`;
  updateComparisonReadout();
  renderPixelCanvas();
}

function clearSecondaryPixel() {
  secondaryPixel = null;
  previewCoordsAlt.textContent = "point B: -";
  updateComparisonReadout();
  renderPixelCanvas();
}

function handleCanvasClick(event) {
  if (!sampledPixels) {
    return;
  }

  const rect = pixelCanvas.getBoundingClientRect();
  const pixelSize = Number(pixelSizeInput.value);
  const x = Math.floor((event.clientX - rect.left) / pixelSize);
  const y = Math.floor((event.clientY - rect.top) / pixelSize);

  if (x < 0 || y < 0 || x >= sampledPixels.width || y >= sampledPixels.height) {
    return;
  }

  setHoveredPixel(x, y);
}

function handleCanvasRightClick(event) {
  if (!sampledPixels) {
    return;
  }

  event.preventDefault();

  const rect = pixelCanvas.getBoundingClientRect();
  const pixelSize = Number(pixelSizeInput.value);
  const x = Math.floor((event.clientX - rect.left) / pixelSize);
  const y = Math.floor((event.clientY - rect.top) / pixelSize);

  if (x < 0 || y < 0 || x >= sampledPixels.width || y >= sampledPixels.height) {
    return;
  }

  setSecondaryPixel(x, y);
}

function applyLoadedImage(image, label, fallbackAddress = "") {
  sourceImage = image;
  sourceImageName = label;
  sourceImageFallbackAddress = fallbackAddress;
  sourceAspectRatio = image.width / image.height;
  autoScaleEnabled = true;
  syncDimensionLimits();
  const defaultResolution = getDefaultResolution(image.width, image.height);
  pixelWidthInput.value = defaultResolution.width;
  pixelHeightInput.value = defaultResolution.height;
  setEmptyStateContent(
    "Image ready",
    "Pixel grid ready to explore.",
    "Click for point A, right click for point B, then compare the offset and color difference here."
  );
  showImageState(true);
  rerenderFromInputs();
  resetHoverState();
  setUploadName(label);
  imageUpload.value = "";
}

function setImageAddressLoading(isLoading) {
  imageAddressInput.disabled = isLoading;
  loadImageAddressButton.disabled = isLoading;
  loadImageAddressButton.textContent = isLoading ? "Loading" : "Load link";
}

function normalizeImageAddress(value) {
  const trimmedAddress = value.trim();

  if (!trimmedAddress) {
    return "";
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(trimmedAddress)) {
    return trimmedAddress;
  }

  return `https://${trimmedAddress}`;
}

function isSupportedImageAddress(address) {
  try {
    const url = new URL(address, window.location.href);
    return ["http:", "https:", "data:", "blob:"].includes(url.protocol);
  } catch (error) {
    return false;
  }
}

function getImageAddressLabel(address) {
  const fallbackLabel = IMAGE_ADDRESS_FALLBACK_LABELS.get(address);

  if (fallbackLabel) {
    return fallbackLabel;
  }

  try {
    const url = new URL(address, window.location.href);

    if (url.protocol === "data:") {
      return "Data image";
    }

    const pathName = decodeURIComponent(url.pathname);
    const fileName = pathName.split("/").filter(Boolean).pop();
    return fileName || url.hostname || "Image address";
  } catch (error) {
    return "Image address";
  }
}

function getImageAddressFallback(address) {
  try {
    const href = new URL(address, window.location.href).href;
    const fallback = IMAGE_ADDRESS_FALLBACKS.get(href);
    return fallback ? new URL(fallback, window.location.href).href : "";
  } catch (error) {
    return "";
  }
}

function loadFallbackImageAddress(fallbackAddress, requestId, resetOnError = false) {
  setImageAddressLoading(true);
  setUploadName("Loading local copy...");

  const fallbackImage = new Image();

  fallbackImage.onload = () => {
    if (requestId !== imageLoadRequestId) {
      return;
    }

    setImageAddressLoading(false);
    applyLoadedImage(fallbackImage, getImageAddressLabel(fallbackAddress));
  };

  fallbackImage.onerror = () => {
    if (requestId !== imageLoadRequestId) {
      return;
    }

    setImageAddressLoading(false);

    if (resetOnError || !sourceImage) {
      resetViewer("The image address could not be loaded. Try a direct PNG, JPG, GIF, or WebP URL.");
    }

    setUploadName("Address failed to load");
  };

  fallbackImage.src = fallbackAddress;
}

function loadImage(file) {
  dropzoneDragDepth = 0;
  setDropzoneActive(false);
  const requestId = ++imageLoadRequestId;
  setImageAddressLoading(false);
  sourceImageFallbackAddress = "";

  if (file.type && !file.type.startsWith("image/")) {
    resetViewer("That file is not a supported image.");
    setUploadName("Unsupported file");
    imageUpload.value = "";
    return;
  }

  setUploadName(`Loading ${file.name}...`);
  const reader = new FileReader();

  reader.onload = () => {
    if (requestId !== imageLoadRequestId) {
      return;
    }

    const image = new Image();

    image.onload = () => {
      if (requestId !== imageLoadRequestId) {
        return;
      }

      applyLoadedImage(image, file.name);
    };

    image.onerror = () => {
      if (requestId !== imageLoadRequestId) {
        return;
      }

      resetViewer("The image could not be loaded. Try a PNG, JPG, GIF, or WebP file.");
      setUploadName("Image failed to load");
      imageUpload.value = "";
    };

    image.src = reader.result;
  };

  reader.onerror = () => {
    if (requestId !== imageLoadRequestId) {
      return;
    }

    resetViewer("The file could not be read. Try choosing the image again.");
    setUploadName("Read failed");
    imageUpload.value = "";
  };

  reader.readAsDataURL(file);
}

function loadImageAddress(rawAddress) {
  const address = normalizeImageAddress(rawAddress);

  if (!address) {
    setUploadName("Paste an image address");
    return;
  }

  if (!isSupportedImageAddress(address)) {
    setUploadName("Unsupported image address");
    return;
  }

  const requestId = ++imageLoadRequestId;
  dropzoneDragDepth = 0;
  setDropzoneActive(false);
  setImageAddressLoading(true);
  setUploadName("Loading image address...");
  imageAddressInput.value = address;

  const image = new Image();
  const protocol = new URL(address, window.location.href).protocol;

  if (protocol === "http:" || protocol === "https:") {
    image.crossOrigin = "anonymous";
  }

  image.onload = () => {
    if (requestId !== imageLoadRequestId) {
      return;
    }

    setImageAddressLoading(false);
    applyLoadedImage(image, getImageAddressLabel(address), getImageAddressFallback(address));
  };

  image.onerror = () => {
    if (requestId !== imageLoadRequestId) {
      return;
    }

    const fallbackAddress = getImageAddressFallback(address);

    if (fallbackAddress) {
      loadFallbackImageAddress(fallbackAddress, requestId);
      return;
    }

    setImageAddressLoading(false);

    if (!sourceImage) {
      resetViewer("The image address could not be loaded. Try a direct PNG, JPG, GIF, or WebP URL.");
    }

    setUploadName("Address failed to load");
  };

  image.src = address;
}

function handleDropzoneDragEnter(event) {
  event.preventDefault();
  dropzoneDragDepth += 1;
  setDropzoneActive(true);
}

function handleDropzoneDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  setDropzoneActive(true);
}

function handleDropzoneDragLeave(event) {
  event.preventDefault();
  dropzoneDragDepth = Math.max(0, dropzoneDragDepth - 1);

  if (dropzoneDragDepth === 0) {
    setDropzoneActive(false);
  }
}

function handleDropzoneDrop(event) {
  event.preventDefault();
  dropzoneDragDepth = 0;
  setDropzoneActive(false);

  const [file] = event.dataTransfer.files;

  if (!file) {
    return;
  }

  loadImage(file);
}

function handleDropzoneKeydown(event) {
  if (event.target !== uploadDropzone) {
    return;
  }

  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  imageUpload.click();
}

pickImageButton.addEventListener("click", () => {
  imageUpload.click();
});

imageUpload.addEventListener("change", (event) => {
  const [file] = event.target.files;

  if (!file) {
    return;
  }

  loadImage(file);
});

imageAddressForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loadImageAddress(imageAddressInput.value);
});

pixelWidthInput.addEventListener("input", () => {
  syncHeightToWidth();
  rerenderFromInputs();
});

pixelHeightInput.addEventListener("input", () => {
  syncWidthToHeight();
  rerenderFromInputs();
});

pixelSizeInput.addEventListener("input", () => {
  autoScaleEnabled = false;
  updatePixelSizeLabel();
  queueRerender();
});

pixelSizeNumberInput.addEventListener("input", () => {
  setPixelSize(pixelSizeNumberInput.value);
  queueRerender();
});

keepAspectButton.addEventListener("click", () => {
  lockAspectRatio = !lockAspectRatio;
  updateAspectLockLabel();
});

toggleAntialiasingButton.addEventListener("click", () => {
  antialiasingEnabled = !antialiasingEnabled;
  updateAntialiasingLabel();

  if (sourceImage) {
    queueRerender({ resample: true });
  }
});

fitSourceButton.addEventListener("click", () => {
  if (!sourceImage) {
    return;
  }

  pixelWidthInput.value = sourceImage.width;
  pixelHeightInput.value = sourceImage.height;
  rerenderFromInputs();
});

pixelCanvas.addEventListener("click", handleCanvasClick);
pixelCanvas.addEventListener("contextmenu", handleCanvasRightClick);
colorToleranceInput.addEventListener("input", () => {
  colorTolerance = clamp(Number(colorToleranceInput.value) || 0, 0, 100);
  updateColorKeepControls();

  if (colorKeepEnabled) {
    renderPixelCanvas();
  }
});
toggleColorKeepButton.addEventListener("click", () => {
  if (!selectedPixel) {
    return;
  }

  colorKeepEnabled = !colorKeepEnabled;
  updateColorKeepControls();
  renderPixelCanvas();
});
downloadColorKeepButton.addEventListener("click", downloadColorKeptImage);
resetColorKeepButton.addEventListener("click", () => {
  resetColorKeep();
  renderPixelCanvas();
});
copyButtons.forEach((button) => {
  button.addEventListener("click", handleCopyButtonClick);
});
uploadDropzone.addEventListener("dragenter", handleDropzoneDragEnter);
uploadDropzone.addEventListener("dragover", handleDropzoneDragOver);
uploadDropzone.addEventListener("dragleave", handleDropzoneDragLeave);
uploadDropzone.addEventListener("drop", handleDropzoneDrop);
uploadDropzone.addEventListener("keydown", handleDropzoneKeydown);

resizeObserver = new ResizeObserver(() => {
  if (!sourceImage) {
    return;
  }

  queueRerender({ autoFit: autoScaleEnabled, forceAutoFit: false });
});

resizeObserver.observe(viewerFrame);

updatePixelSizeLabel();
updateAspectLockLabel();
updateAntialiasingLabel();
resetHoverState();
showImageState(false);
syncDimensionLimits();
setUploadName("No image selected");
