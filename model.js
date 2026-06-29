const modelUpload = document.querySelector("#modelUpload");
const pickModelButton = document.querySelector("#pickModelButton");
const modelUploadName = document.querySelector("#modelUploadName");
const modelZoom = document.querySelector("#modelZoom");
const modelZoomValue = document.querySelector("#modelZoomValue");
const modelViewMode = document.querySelector("#modelViewMode");
const modelYaw = document.querySelector("#modelYaw");
const modelYawValue = document.querySelector("#modelYawValue");
const modelPitch = document.querySelector("#modelPitch");
const modelPitchValue = document.querySelector("#modelPitchValue");
const modelViewModeBlock = modelViewMode.closest(".control-block");
const modelZoomBlock = modelZoom.closest(".control-block");
const modelWireBlock = document.querySelector("#modelWireBlock");
const modelWireSize = document.querySelector("#modelWireSize");
const modelWireSizeValue = document.querySelector("#modelWireSizeValue");
const toggleWireMeshButton = document.querySelector("#toggleWireMesh");
const modelColorBlock = document.querySelector("#modelColorBlock");
const modelColor = document.querySelector("#modelColor");
const modelColorValue = document.querySelector("#modelColorValue");
const modelQuality = document.querySelector("#modelQuality");
const modelQualityNumber = document.querySelector("#modelQualityNumber");
const modelQualityBlock = document.querySelector("#modelQualityBlock");
const toggleSlideshowButton = document.querySelector("#toggleSlideshow");
const resetViewButton = document.querySelector("#resetView");
const modelStatus = document.querySelector("#modelStatus");
const selectedBlockStatus = document.querySelector("#selectedBlockStatus");
const selectedBlockCoords = document.querySelector("#selectedBlockCoords");
const secondaryBlockStatus = document.querySelector("#secondaryBlockStatus");
const secondaryBlockCoords = document.querySelector("#secondaryBlockCoords");
const wireframeAngleStatus = document.querySelector("#wireframeAngleStatus");
const wireframeSecondaryAngleStatus = document.querySelector("#wireframeSecondaryAngleStatus");
const wireframeAngle = document.querySelector("#wireframeAngle");
const wireframeSecondaryAngle = document.querySelector("#wireframeSecondaryAngle");
const panelMeasurements = document.querySelector("#panelMeasurements");
const primaryPanelSummary = document.querySelector("#primaryPanelSummary");
const primaryPanelLengths = document.querySelector("#primaryPanelLengths");
const primaryPanelAngles = document.querySelector("#primaryPanelAngles");
const secondaryPanelSummary = document.querySelector("#secondaryPanelSummary");
const secondaryPanelLengths = document.querySelector("#secondaryPanelLengths");
const secondaryPanelAngles = document.querySelector("#secondaryPanelAngles");
const modelLayout = document.querySelector("#modelLayout");
const viewerSplitLayout = document.querySelector("#viewerSplitLayout");
const mainViewerPanel = document.querySelector("#mainViewerPanel");
const layerPanel = document.querySelector("#layerPanel");
const modelViewerFrame = document.querySelector("#modelViewerFrame");
const modelCanvas = document.querySelector("#modelCanvas");
const modelEmptyState = document.querySelector("#modelEmptyState");
const toggleFullscreenButton = document.querySelector("#toggleFullscreen");
const layerPrevButton = document.querySelector("#layerPrev");
const layerNextButton = document.querySelector("#layerNext");
const layerJumpButton = document.querySelector("#layerJump");
const layerSecondaryJumpButton = document.querySelector("#layerSecondaryJump");
const layerInfo = document.querySelector("#layerInfo");
const layerViewerFrame = document.querySelector("#layerViewerFrame");
const layerCanvas = document.querySelector("#layerCanvas");
const layerEmptyState = document.querySelector("#layerEmptyState");
const layerContext = layerCanvas.getContext("2d");

const DEFAULT_VIEW = {
  zoom: 1.4,
  yaw: 25,
  pitch: -18,
  wireSize: 2,
  quality: 14,
  modelColor: "#e9dccd",
};

const QUALITY_MIN = 6;
const QUALITY_MAX = 150;

const MAX_CLICK_HOLD_MS = 220;

const BLOCK_PALETTES = {
  side: {
    base: "#d97a2b",
    highlight: "#f4ab63",
    shadow: "#a75519",
    detail: "#6f3410",
  },
  top: {
    base: "#f0a24c",
    highlight: "#ffd08c",
    shadow: "#c97725",
    detail: "#9a581a",
  },
  bottom: {
    base: "#8a4215",
    highlight: "#aa6130",
    shadow: "#552307",
    detail: "#3b1604",
  },
};

const SELECTED_BLOCK_PALETTES = {
  side: {
    base: "#2f80ed",
    highlight: "#7db8ff",
    shadow: "#1f569d",
    detail: "#143969",
  },
  top: {
    base: "#63a5ff",
    highlight: "#b6d5ff",
    shadow: "#3d74c1",
    detail: "#284f89",
  },
  bottom: {
    base: "#183b72",
    highlight: "#315c99",
    shadow: "#10274a",
    detail: "#091b34",
  },
};

const LAYER_BLOCK_PALETTES = {
  side: {
    base: "#e2b122",
    highlight: "#fff08a",
    shadow: "#ba8612",
    detail: "#8f6107",
  },
  top: {
    base: "#f4c731",
    highlight: "#fff19a",
    shadow: "#d39c14",
    detail: "#9f6d08",
  },
  bottom: {
    base: "#a7740d",
    highlight: "#cc9920",
    shadow: "#775208",
    detail: "#5a3c05",
  },
};

const SECONDARY_BLOCK_PALETTES = {
  side: {
    base: "#8f3f16",
    highlight: "#bd7049",
    shadow: "#5f240a",
    detail: "#3f1704",
  },
  top: {
    base: "#a9501e",
    highlight: "#d48357",
    shadow: "#72310d",
    detail: "#4d1d05",
  },
  bottom: {
    base: "#542109",
    highlight: "#6f3212",
    shadow: "#2f1104",
    detail: "#1d0a02",
  },
};

const state = {
  three: null,
  loaders: null,
  orbitControls: null,
  scene: null,
  camera: null,
  renderer: null,
  raycaster: null,
  voxelMesh: null,
  wireframeGroup: null,
  wireframeFillGroup: null,
  primaryWireframeHighlight: null,
  secondaryWireframeHighlight: null,
  selectedVoxelMesh: null,
  secondaryVoxelMesh: null,
  currentLayerMesh: null,
  voxelEntries: [],
  originalSourceMeshes: [],
  sourceRoot: null,
  sourceMeshes: [],
  sourceSize: 1,
  renderQueued: false,
  selectedInstanceId: null,
  selectedVoxelKey: null,
  secondaryVoxelKey: null,
  voxelMinY: 0,
  voxelMaxY: 0,
  voxelMinX: 0,
  voxelMaxX: 0,
  voxelMinZ: 0,
  voxelMaxZ: 0,
  currentLayerY: 0,
  layerGridWidth: 0,
  layerGridDepth: 0,
  layerGridSize: 0,
  layerOffsetX: 0,
  layerOffsetZ: 0,
  layerTextureCanvas: null,
  selectedLayerTextureCanvas: null,
  secondaryLayerTextureCanvas: null,
  dragging: false,
  dragStart: null,
  dragDistance: 0,
  pointerDownAt: 0,
  frameResizeAnimation: 0,
  rendererWidth: 0,
  rendererHeight: 0,
  viewModeTransitionId: 0,
  viewModeTransitionTimeout: 0,
  slideshowVisible: true,
  wireMeshVisible: true,
  primaryWireframeAngle: null,
  secondaryWireframeAngle: null,
  primaryWireframeLine: null,
  secondaryWireframeLine: null,
  primaryPanelSelection: null,
  secondaryPanelSelection: null,
  primaryPanelHighlight: null,
  secondaryPanelHighlight: null,
  targetX: 0,
  targetY: 0,
  targetZ: 0,
  currentZoom: DEFAULT_VIEW.zoom,
  currentYaw: DEFAULT_VIEW.yaw,
  currentPitch: DEFAULT_VIEW.pitch,
  currentTargetX: 0,
  currentTargetY: 0,
  currentTargetZ: 0,
  cameraMotionFrame: 0,
  controlsAnimationFrame: 0,
  syncingOrbitControls: false,
  splitFactory: null,
  viewerSplit: null,
  viewerSplitSizes: [58, 42],
  viewerSplitSyncFrame: 0,
  viewerSplitDragging: false,
};

layerContext.imageSmoothingEnabled = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle) {
  let normalized = angle % 360;

  if (normalized > 180) {
    normalized -= 360;
  }

  if (normalized < -180) {
    normalized += 360;
  }

  return normalized;
}

function setStatus(text) {
  modelStatus.textContent = text;
}

function updateSlideshowToggleLabel() {
  toggleSlideshowButton.textContent = `Slideshow: ${state.slideshowVisible ? "On" : "Off"}`;
}

function updateWireMeshToggleLabel() {
  toggleWireMeshButton.textContent = `Mesh: ${state.wireMeshVisible ? "On" : "Off"}`;
}

function updateFullscreenLabel() {
  toggleFullscreenButton.textContent =
    document.fullscreenElement === modelViewerFrame ? "Exit fullscreen" : "Fullscreen";
}

function setModelUploadName(text) {
  modelUploadName.textContent = text;
}

function updateWireframeAngleReadout() {
  wireframeSecondaryAngle.textContent = state.secondaryPanelSelection
    ? `triangle: ${state.secondaryPanelSelection.faceIndex + 1}`
    : "triangle: -";

  if (!state.primaryPanelSelection || !state.secondaryPanelSelection) {
    wireframeAngle.textContent = "-";
    return;
  }

  const angle =
    (state.primaryPanelSelection.normal.angleTo(state.secondaryPanelSelection.normal) * 180) / Math.PI;
  wireframeAngle.textContent = `${angle.toFixed(1)}deg`;
}

function updateWireframeLineHighlights() {
  const updateHighlight = (highlight, line) => {
    if (!highlight) {
      return;
    }

    if (!line) {
      highlight.visible = false;
      return;
    }

    highlight.geometry.setPositions([
      line.start.x,
      line.start.y,
      line.start.z,
      line.end.x,
      line.end.y,
      line.end.z,
    ]);
    highlight.visible = modelViewMode.value === "wireframe";
  };

  updateHighlight(state.primaryWireframeHighlight, state.primaryWireframeLine);
  updateHighlight(state.secondaryWireframeHighlight, state.secondaryWireframeLine);
  queueRender();
}

function resetWireframeAngle() {
  state.primaryWireframeAngle = null;
  state.secondaryWireframeAngle = null;
  state.primaryWireframeLine = null;
  state.secondaryWireframeLine = null;
  updateWireframeAngleReadout();
  updateWireframeLineHighlights();
}

function formatMeasurement(value) {
  return Number.isFinite(value) ? value.toFixed(value >= 10 ? 2 : 3) : "-";
}

function formatTriangleLengths(panel) {
  if (!panel) {
    return "Lengths: -";
  }

  return `Lengths: AB ${formatMeasurement(panel.lengths.ab)}, BC ${formatMeasurement(panel.lengths.bc)}, CA ${formatMeasurement(panel.lengths.ca)}`;
}

function formatTriangleAngles(panel) {
  if (!panel) {
    return "Angles: -";
  }

  return `Angles: A ${formatMeasurement(panel.angles.a)}deg, B ${formatMeasurement(panel.angles.b)}deg, C ${formatMeasurement(panel.angles.c)}deg`;
}

function updatePanelReadout() {
  primaryPanelSummary.textContent = state.primaryPanelSelection
    ? `Triangle ${state.primaryPanelSelection.faceIndex + 1}`
    : "Click a triangle in wireframe mode.";
  primaryPanelLengths.textContent = formatTriangleLengths(state.primaryPanelSelection);
  primaryPanelAngles.textContent = formatTriangleAngles(state.primaryPanelSelection);
  secondaryPanelSummary.textContent = state.secondaryPanelSelection
    ? `Triangle ${state.secondaryPanelSelection.faceIndex + 1}`
    : "Right click a second triangle to compare it.";
  secondaryPanelLengths.textContent = formatTriangleLengths(state.secondaryPanelSelection);
  secondaryPanelAngles.textContent = formatTriangleAngles(state.secondaryPanelSelection);
  updateWireframeAngleReadout();
}

function updatePanelHighlight(highlight, selection) {
  if (!highlight) {
    return;
  }

  if (!selection || modelViewMode.value !== "wireframe") {
    highlight.visible = false;
    return;
  }

  const offsetVertices = selection.vertices.map((vertex) =>
    vertex.clone().addScaledVector(selection.normal, Math.max(state.sourceSize * 0.0015, 0.002))
  );
  highlight.geometry.setFromPoints(offsetVertices);
  highlight.visible = true;
}

function updatePanelHighlights() {
  updatePanelHighlight(state.primaryPanelHighlight, state.primaryPanelSelection);
  updatePanelHighlight(state.secondaryPanelHighlight, state.secondaryPanelSelection);
  queueRender();
}

function clearPanelSelections() {
  state.primaryPanelSelection = null;
  state.secondaryPanelSelection = null;
  updatePanelReadout();
  updatePanelHighlights();
}

function setPrimaryPanel(selection) {
  state.primaryPanelSelection = selection;

  if (
    state.secondaryPanelSelection &&
    selection &&
    state.secondaryPanelSelection.key === selection.key
  ) {
    state.secondaryPanelSelection = null;
  }

  updatePanelReadout();
  updatePanelHighlights();
}

function setSecondaryPanel(selection) {
  state.secondaryPanelSelection = selection;

  if (
    state.primaryPanelSelection &&
    selection &&
    state.primaryPanelSelection.key === selection.key
  ) {
    state.primaryPanelSelection = null;
  }

  updatePanelReadout();
  updatePanelHighlights();
}

function getVoxelKey(entry) {
  return `${entry.x}:${entry.y}:${entry.z}`;
}

function getSelectedEntry() {
  if (!state.selectedVoxelKey) {
    return null;
  }

  return state.voxelEntries.find((entry) => getVoxelKey(entry) === state.selectedVoxelKey) || null;
}

function getSecondaryEntry() {
  if (!state.secondaryVoxelKey) {
    return null;
  }

  return state.voxelEntries.find((entry) => getVoxelKey(entry) === state.secondaryVoxelKey) || null;
}

function setSelectedBlock(entry) {
  if (!entry) {
    state.selectedInstanceId = null;
    state.selectedVoxelKey = null;
    selectedBlockCoords.textContent = "x: -, y: -, z: -";
    updateSelectedVoxelMesh();
    updateSecondaryVoxelMesh();
    renderLayerCanvas();
    return;
  }

  state.selectedInstanceId = entry.instanceId;
  state.selectedVoxelKey = getVoxelKey(entry);
  state.currentLayerY = entry.y;
  selectedBlockCoords.textContent = `x: ${entry.x}, y: ${entry.y - state.voxelMinY}, z: ${entry.z}`;
  resetWireframeAngle();
  updateSelectedVoxelMesh();
  updateSecondaryVoxelMesh();
  renderLayerCanvas();
}

function setSecondaryBlock(entry) {
  if (!entry) {
    state.secondaryVoxelKey = null;
    secondaryBlockCoords.textContent = "x: -, y: -, z: -";
    updateSecondaryVoxelMesh();
    renderLayerCanvas();
    return;
  }

  state.secondaryVoxelKey = getVoxelKey(entry);
  secondaryBlockCoords.textContent = `x: ${entry.x}, y: ${entry.y - state.voxelMinY}, z: ${entry.z}`;
  updateSecondaryVoxelMesh();
  renderLayerCanvas();
}

function updateControlLabels() {
  modelZoomValue.textContent = `${Number(modelZoom.value).toFixed(1)}x`;
  modelYawValue.textContent = `${Math.round(Number(modelYaw.value))}deg`;
  modelPitchValue.textContent = `${Math.round(Number(modelPitch.value))}deg`;
  modelWireSizeValue.textContent = `${(Number(modelWireSize.value) / 10).toFixed(1)}`;
  modelColorValue.textContent = (modelColor.value || DEFAULT_VIEW.modelColor).toUpperCase();
}

function normalizeQualityValue(value) {
  return clamp(Math.round(Number(value) || DEFAULT_VIEW.quality), QUALITY_MIN, QUALITY_MAX);
}

function syncQualityControls(value) {
  const quality = normalizeQualityValue(value);
  modelQuality.value = String(quality);
  modelQualityNumber.value = String(quality);
  updateControlLabels();
  return quality;
}

function rebuildVoxelPreview() {
  if (!state.sourceMeshes.length) {
    return;
  }

  clearSceneModel({ preserveSource: true });
  buildVoxelEntries();
  updateCamera({ immediate: true });
}

function addVoxelPoint(voxelSet, point, voxelSize) {
  voxelSet.add(
    [
      Math.round(point.x / voxelSize),
      Math.round(point.y / voxelSize),
      Math.round(point.z / voxelSize),
    ].join(":")
  );
}

function addTriangleVoxels(voxelSet, a, b, c, voxelSize) {
  const edgeAB = a.distanceTo(b);
  const edgeBC = b.distanceTo(c);
  const edgeCA = c.distanceTo(a);
  const longestEdge = Math.max(edgeAB, edgeBC, edgeCA);
  const steps = clamp(Math.ceil((longestEdge / voxelSize) * 2.5), 1, 160);
  const point = new state.three.Vector3();

  for (let row = 0; row <= steps; row += 1) {
    const v = row / steps;
    const columns = Math.max(1, steps - row);

    for (let column = 0; column <= columns; column += 1) {
      const u = column / steps;
      const w = 1 - u - v;

      if (w < -0.00001) {
        continue;
      }

      point
        .copy(a)
        .multiplyScalar(w)
        .addScaledVector(b, u)
        .addScaledVector(c, v);
      addVoxelPoint(voxelSet, point, voxelSize);
    }
  }
}

function fillVoxelInterior(voxelSet) {
  const lines = new Map();

  for (const key of voxelSet) {
    const [x, y, z] = key.split(":").map(Number);
    const lineKey = `${y}:${z}`;
    const line = lines.get(lineKey);

    if (line) {
      line.min = Math.min(line.min, x);
      line.max = Math.max(line.max, x);
    } else {
      lines.set(lineKey, { min: x, max: x });
    }
  }

  for (const [lineKey, line] of lines) {
    if (line.max - line.min < 2) {
      continue;
    }

    for (let x = line.min + 1; x < line.max; x += 1) {
      voxelSet.add(`${x}:${lineKey}`);
    }
  }
}

function updateWireframeAppearance() {
  const wireSize = (Number(modelWireSize.value) || DEFAULT_VIEW.wireSize) / 10;

  if (state.wireframeGroup) {
    for (const child of state.wireframeGroup.children) {
      if (!child.material) {
        continue;
      }

      child.material.linewidth = wireSize;
      child.material.needsUpdate = true;
    }
  }

  if (state.primaryWireframeHighlight?.material) {
    state.primaryWireframeHighlight.material.linewidth = Math.max(wireSize + 3, 3.5);
    state.primaryWireframeHighlight.material.needsUpdate = true;
  }

  if (state.secondaryWireframeHighlight?.material) {
    state.secondaryWireframeHighlight.material.linewidth = Math.max(wireSize + 3, 3.5);
    state.secondaryWireframeHighlight.material.needsUpdate = true;
  }

  queueRender();
}

function updateModelColor() {
  if (!state.wireframeFillGroup) {
    return;
  }

  const colorValue = modelColor.value || DEFAULT_VIEW.modelColor;

  for (const child of state.wireframeFillGroup.children) {
    if (!child.material?.color) {
      continue;
    }

    child.material.color.set(colorValue);
    child.material.needsUpdate = true;
  }

  queueRender();
}

function updateControlVisibility() {
  const hasModel = !modelCanvas.hidden;
  const isVoxelMode = modelViewMode.value === "voxel";
  const canShowMeshColor = hasModel && !isVoxelMode && state.wireMeshVisible;

  modelViewModeBlock.hidden = false;
  modelZoomBlock.hidden = false;
  modelWireBlock.hidden = isVoxelMode;
  toggleWireMeshButton.hidden = isVoxelMode;
  modelColorBlock.hidden = !canShowMeshColor;
  modelQualityBlock.hidden = !isVoxelMode;
  resetViewButton.hidden = false;
  toggleSlideshowButton.hidden = !isVoxelMode;
  selectedBlockStatus.hidden = !hasModel || !isVoxelMode;
  secondaryBlockStatus.hidden = !hasModel || !isVoxelMode;
  wireframeAngleStatus.hidden = !hasModel || isVoxelMode;
  wireframeSecondaryAngleStatus.hidden = !hasModel || isVoxelMode;
  panelMeasurements.hidden = !hasModel || isVoxelMode;

  modelViewMode.disabled = false;
  modelZoom.disabled = !hasModel;
  modelWireSize.disabled = !hasModel || isVoxelMode;
  toggleWireMeshButton.disabled = !hasModel || isVoxelMode;
  modelColor.disabled = !canShowMeshColor;
  modelQuality.disabled = !hasModel || !isVoxelMode;
  modelQualityNumber.disabled = !hasModel || !isVoxelMode;
  resetViewButton.disabled = !hasModel;
  toggleSlideshowButton.disabled = !hasModel || !isVoxelMode;
}

function disposeMeshCollection(meshes) {
  for (const mesh of meshes) {
    mesh.geometry?.dispose();
    mesh.material?.dispose?.();
  }
}

function cloneSourceMesh(mesh, geometry = mesh.geometry.clone()) {
  const clone = new state.three.Mesh(geometry, new state.three.MeshBasicMaterial());
  clone.position.copy(mesh.position);
  clone.quaternion.copy(mesh.quaternion);
  clone.scale.copy(mesh.scale);
  clone.updateMatrixWorld(true);
  return clone;
}

function buildWorkingSourceMeshes() {
  return state.originalSourceMeshes.map((mesh) => {
    const geometry = mesh.geometry.clone();
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return cloneSourceMesh(mesh, geometry);
  });
}

function rebuildModelFromSourceMeshes() {
  if (!state.originalSourceMeshes.length) {
    return;
  }

  clearSceneModel({ preserveSource: true });
  disposeMeshCollection(state.sourceMeshes);
  state.sourceMeshes = buildWorkingSourceMeshes();
  buildVoxelEntries();
  updateCamera({ immediate: true });
  queueRender();
}

function setViewerState(hasModel, statusText) {
  modelViewerFrame.classList.toggle("empty", !hasModel);
  modelCanvas.hidden = !hasModel;
  modelEmptyState.hidden = hasModel;
  setStatus(statusText);
  updateControlVisibility();
}

function setLayerViewerState(hasLayer, message = "") {
  layerViewerFrame.classList.toggle("empty", !hasLayer);
  layerCanvas.hidden = !hasLayer;
  layerEmptyState.hidden = hasLayer;
  layerEmptyState.textContent = message;
}

function updateLayerControls() {
  const hasLayers = state.voxelEntries.length > 0;
  const layerCount = hasLayers ? state.voxelMaxY - state.voxelMinY + 1 : 0;
  const hasSelectedBlock = Boolean(getSelectedEntry());
  const hasSecondaryBlock = Boolean(getSecondaryEntry());
  const isVoxelMode = modelViewMode.value === "voxel";

  layerPrevButton.disabled = !isVoxelMode || !hasLayers || state.currentLayerY <= state.voxelMinY;
  layerNextButton.disabled = !isVoxelMode || !hasLayers || state.currentLayerY >= state.voxelMaxY;
  layerJumpButton.disabled = !isVoxelMode || !hasLayers || !hasSelectedBlock;
  layerSecondaryJumpButton.disabled = !isVoxelMode || !hasLayers || !hasSecondaryBlock;
  layerInfo.textContent = !isVoxelMode
    ? "Voxel mode only"
    : hasLayers
    ? `${state.currentLayerY - state.voxelMinY}/${layerCount - 1}`
    : "";
}

function renderLayerCanvas() {
  if (modelViewMode.value !== "voxel") {
    setLayerViewerState(false, "Switch to voxel mode to browse model layers.");
    updateLayerControls();
    return;
  }

  if (!state.voxelEntries.length) {
    setLayerViewerState(false, "Upload a model to browse its voxel layers here.");
    updateLayerControls();
    return;
  }

  const layerEntries = state.voxelEntries.filter((entry) => entry.y === state.currentLayerY);
  const width = state.voxelMaxX - state.voxelMinX + 1;
  const depth = state.voxelMaxZ - state.voxelMinZ + 1;
  const gridSize = Math.max(width, depth);
  const textureSize = state.layerTextureCanvas?.width || 16;
  const cellSize = Math.max(12, Math.floor(640 / Math.max(gridSize, 1)));
  const displaySize = gridSize * cellSize;
  state.layerGridWidth = width;
  state.layerGridDepth = depth;
  state.layerGridSize = gridSize;
  state.layerOffsetX = Math.floor((gridSize - width) / 2);
  state.layerOffsetZ = Math.floor((gridSize - depth) / 2);

  layerCanvas.width = gridSize * textureSize;
  layerCanvas.height = gridSize * textureSize;
  layerCanvas.style.width = `${displaySize}px`;
  layerCanvas.style.height = "auto";
  layerCanvas.style.aspectRatio = "1 / 1";
  layerContext.imageSmoothingEnabled = false;
  layerContext.clearRect(0, 0, layerCanvas.width, layerCanvas.height);

  for (const entry of layerEntries) {
    const x = (state.layerOffsetX + (state.voxelMaxX - entry.x)) * textureSize;
    const z = (state.layerOffsetZ + (state.voxelMaxZ - entry.z)) * textureSize;
    const textureCanvas =
      getVoxelKey(entry) === state.selectedVoxelKey
        ? state.selectedLayerTextureCanvas
        : getVoxelKey(entry) === state.secondaryVoxelKey
        ? state.secondaryLayerTextureCanvas
        : state.layerTextureCanvas;
    layerContext.drawImage(textureCanvas, x, z);
  }

  if (width > 0 && depth > 0) {
    layerCanvas.style.boxShadow = "inset 0 0 0 1px rgba(34, 23, 15, 0.16)";
  }

  setLayerViewerState(true);
  updateLayerControls();
  updateCurrentLayerMesh();
}

function resizeRenderer() {
  if (!state.renderer || !state.camera) {
    return;
  }

  const frameStyle = window.getComputedStyle(modelViewerFrame);
  const horizontalPadding =
    Number.parseFloat(frameStyle.paddingLeft) + Number.parseFloat(frameStyle.paddingRight);
  const verticalPadding =
    Number.parseFloat(frameStyle.paddingTop) + Number.parseFloat(frameStyle.paddingBottom);
  const width = Math.max(260, Math.floor(modelViewerFrame.clientWidth - horizontalPadding));
  const height = Math.max(260, Math.floor(modelViewerFrame.clientHeight - verticalPadding));

  if (width === state.rendererWidth && height === state.rendererHeight) {
    return;
  }

  state.rendererWidth = width;
  state.rendererHeight = height;

  state.renderer.setSize(width, height, false);
  modelCanvas.style.width = `${width}px`;
  modelCanvas.style.height = `${height}px`;
  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();

  if (state.wireframeGroup) {
    for (const child of state.wireframeGroup.children) {
      child.material?.resolution?.set(width, height);
    }
  }

  state.primaryWireframeHighlight?.material?.resolution?.set(width, height);
  state.secondaryWireframeHighlight?.material?.resolution?.set(width, height);
  queueRender();
}

function queueRender() {
  if (!state.renderer || !state.scene || !state.camera || state.renderQueued) {
    return;
  }

  state.renderQueued = true;
  requestAnimationFrame(() => {
    state.renderQueued = false;
    state.renderer.render(state.scene, state.camera);
  });
}

function stopCameraMotion() {
  if (state.cameraMotionFrame) {
    cancelAnimationFrame(state.cameraMotionFrame);
    state.cameraMotionFrame = 0;
  }
}

function stopControlsAnimation() {
  if (state.controlsAnimationFrame) {
    cancelAnimationFrame(state.controlsAnimationFrame);
    state.controlsAnimationFrame = 0;
  }
}

function getRadiusForZoom(zoom) {
  return (3.8 / zoom) * Math.max(1, state.sourceSize);
}

function getZoomForRadius(radius) {
  const safeRadius = Math.max(radius, 0.0001);
  return clamp((3.8 * Math.max(1, state.sourceSize)) / safeRadius, Number(modelZoom.min) || 0.4, Number(modelZoom.max) || 10);
}

function syncInputsFromCamera() {
  if (!state.camera) {
    return;
  }

  const target = state.orbitControls?.target;
  const targetX = target?.x ?? state.targetX;
  const targetY = target?.y ?? state.targetY;
  const targetZ = target?.z ?? state.targetZ;
  const offsetX = state.camera.position.x - targetX;
  const offsetY = state.camera.position.y - targetY;
  const offsetZ = state.camera.position.z - targetZ;
  const radius = Math.max(Math.hypot(offsetX, offsetY, offsetZ), 0.0001);
  const horizontalRadius = Math.max(Math.hypot(offsetX, offsetZ), 0.0001);
  const yaw = normalizeAngle((Math.atan2(offsetX, offsetZ) * 180) / Math.PI);
  const pitch = clamp((Math.atan2(offsetY, horizontalRadius) * 180) / Math.PI, -89.5, 89.5);
  const zoom = getZoomForRadius(radius);
  state.camera.near = Math.max(0.1, radius / 500);
  state.camera.far = Math.max(200, radius * 6, state.sourceSize * 8);
  state.camera.updateProjectionMatrix();

  state.targetX = targetX;
  state.targetY = targetY;
  state.targetZ = targetZ;
  state.currentTargetX = targetX;
  state.currentTargetY = targetY;
  state.currentTargetZ = targetZ;
  state.currentZoom = zoom;
  state.currentYaw = yaw;
  state.currentPitch = pitch;

  modelZoom.value = String(zoom);
  modelYaw.value = String(yaw);
  modelPitch.value = String(pitch);
  updateControlLabels();
}

function startControlsAnimation() {
  if (!state.orbitControls || state.controlsAnimationFrame) {
    return;
  }

  const animate = () => {
    state.controlsAnimationFrame = 0;

    if (!state.orbitControls) {
      return;
    }

    const changed = state.orbitControls.update();

    if (changed) {
      syncInputsFromCamera();
      queueRender();
      state.controlsAnimationFrame = requestAnimationFrame(animate);
    }
  };

  state.controlsAnimationFrame = requestAnimationFrame(animate);
}

function applyCameraState(zoom, yawDegrees, pitchDegrees, targetX, targetY, targetZ) {
  if (!state.camera) {
    return;
  }

  const radius = getRadiusForZoom(zoom);
  state.camera.near = Math.max(0.1, radius / 500);
  state.camera.far = Math.max(200, radius * 6, state.sourceSize * 8);
  state.camera.updateProjectionMatrix();
  const yaw = (yawDegrees * Math.PI) / 180;
  const pitch = (pitchDegrees * Math.PI) / 180;
  const horizontalRadius = radius * Math.cos(pitch);

  state.camera.position.set(
    targetX + Math.sin(yaw) * horizontalRadius,
    targetY + radius * Math.sin(pitch),
    targetZ + Math.cos(yaw) * horizontalRadius
  );
  state.camera.lookAt(targetX, targetY, targetZ);
  queueRender();
}

function updateCamera(options = {}) {
  if (!state.camera) {
    return;
  }

  const { immediate = false } = options;
  const desiredZoom = Number(modelZoom.value);
  const desiredYaw = Number(modelYaw.value);
  const desiredPitch = Number(modelPitch.value);
  const desiredTargetX = state.targetX;
  const desiredTargetY = state.targetY;
  const desiredTargetZ = state.targetZ;
  stopCameraMotion();
  state.currentZoom = desiredZoom;
  state.currentYaw = desiredYaw;
  state.currentPitch = desiredPitch;
  state.currentTargetX = desiredTargetX;
  state.currentTargetY = desiredTargetY;
  state.currentTargetZ = desiredTargetZ;

  applyCameraState(
    state.currentZoom,
    state.currentYaw,
    state.currentPitch,
    state.currentTargetX,
    state.currentTargetY,
    state.currentTargetZ
  );

  if (state.orbitControls) {
    state.orbitControls.minDistance = getRadiusForZoom(Number(modelZoom.max) || 10);
    state.orbitControls.maxDistance = getRadiusForZoom(Number(modelZoom.min) || 0.4);
    state.syncingOrbitControls = true;
    state.orbitControls.target.set(desiredTargetX, desiredTargetY, desiredTargetZ);
    state.orbitControls.update();
    state.syncingOrbitControls = false;
  }

  if (!immediate) {
    startControlsAnimation();
  }
}

function updateSelectedVoxelMesh() {
  if (!state.selectedVoxelMesh || !state.voxelEntries.length) {
    return;
  }

  if (!state.selectedVoxelKey) {
    state.selectedInstanceId = null;
    state.selectedVoxelMesh.visible = false;
    queueRender();
    return;
  }

  const entry = getSelectedEntry();

  if (!entry) {
    state.selectedInstanceId = null;
    state.selectedVoxelKey = null;
    state.selectedVoxelMesh.visible = false;
    queueRender();
    return;
  }

  state.selectedInstanceId = entry.instanceId;
  state.selectedVoxelMesh.position.set(
    entry.x * state.voxelMesh.userData.voxelSize,
    entry.y * state.voxelMesh.userData.voxelSize,
    entry.z * state.voxelMesh.userData.voxelSize
  );
  state.selectedVoxelMesh.visible = true;
  queueRender();
}

function updateSecondaryVoxelMesh() {
  if (!state.secondaryVoxelMesh || !state.voxelEntries.length) {
    return;
  }

  if (!state.secondaryVoxelKey || modelViewMode.value !== "voxel") {
    state.secondaryVoxelMesh.visible = false;
    queueRender();
    return;
  }

  const entry = getSecondaryEntry();

  if (!entry || getVoxelKey(entry) === state.selectedVoxelKey) {
    if (!entry) {
      state.secondaryVoxelKey = null;
      secondaryBlockCoords.textContent = "x: -, y: -, z: -";
    }

    state.secondaryVoxelMesh.visible = false;
    queueRender();
    return;
  }

  state.secondaryVoxelMesh.position.set(
    entry.x * state.voxelMesh.userData.voxelSize,
    entry.y * state.voxelMesh.userData.voxelSize,
    entry.z * state.voxelMesh.userData.voxelSize
  );
  state.secondaryVoxelMesh.visible = true;
  queueRender();
}

function updateCurrentLayerMesh() {
  if (
    !state.currentLayerMesh ||
    !state.voxelMesh ||
    !state.voxelEntries.length ||
    modelViewMode.value !== "voxel"
  ) {
    if (state.currentLayerMesh) {
      state.currentLayerMesh.visible = false;
      queueRender();
    }
    return;
  }

  const voxelSize = state.voxelMesh.userData.voxelSize;
  const layerEntries = state.voxelEntries.filter(
    (entry) =>
      entry.y === state.currentLayerY &&
      getVoxelKey(entry) !== state.selectedVoxelKey &&
      getVoxelKey(entry) !== state.secondaryVoxelKey
  );
  const matrix = new state.three.Matrix4();

  state.currentLayerMesh.count = layerEntries.length;
  for (let index = 0; index < layerEntries.length; index += 1) {
    const entry = layerEntries[index];
    matrix.makeTranslation(entry.x * voxelSize, entry.y * voxelSize, entry.z * voxelSize);
    state.currentLayerMesh.setMatrixAt(index, matrix);
  }

  state.currentLayerMesh.instanceMatrix.needsUpdate = true;
  state.currentLayerMesh.visible = layerEntries.length > 0;
  queueRender();
}

function stopFrameResizeAnimation() {
  if (state.frameResizeAnimation) {
    cancelAnimationFrame(state.frameResizeAnimation);
    state.frameResizeAnimation = 0;
  }
}

function stopViewModeTransitionTimeout() {
  if (state.viewModeTransitionTimeout) {
    window.clearTimeout(state.viewModeTransitionTimeout);
    state.viewModeTransitionTimeout = 0;
  }
}

function isStackedModelLayout() {
  return window.matchMedia("(max-width: 920px)").matches;
}

function shouldEnableViewerSplit() {
  return modelViewMode.value === "voxel" && state.slideshowVisible && !isStackedModelLayout();
}

async function ensureSplitFactory() {
  if (state.splitFactory) {
    return;
  }

  const splitModule = await import("https://esm.sh/split.js@1.6.5");
  state.splitFactory = splitModule.default || splitModule.Split || splitModule;
}

function clearViewerSplitStyles() {
  mainViewerPanel.style.width = "";
  mainViewerPanel.style.flexBasis = "";
  layerPanel.style.width = "";
  layerPanel.style.flexBasis = "";
}

function setViewerSplitDragging(isDragging) {
  state.viewerSplitDragging = isDragging;
  modelLayout.classList.toggle("is-splitting", isDragging);

  if (isDragging) {
    modelViewerFrame.style.height = `${modelViewerFrame.getBoundingClientRect().height}px`;
    return;
  }

  modelViewerFrame.style.height = "";
}

function stopViewerSplitSync() {
  if (state.viewerSplitSyncFrame) {
    cancelAnimationFrame(state.viewerSplitSyncFrame);
    state.viewerSplitSyncFrame = 0;
  }
}

function scheduleViewerSplitSync() {
  if (state.viewerSplitDragging) {
    return;
  }

  if (state.viewerSplitSyncFrame) {
    return;
  }

  state.viewerSplitSyncFrame = requestAnimationFrame(() => {
    state.viewerSplitSyncFrame = 0;
    if (!state.viewerSplitDragging) {
      syncModelViewerFrameHeight(true);
    }
    resizeRenderer();
    queueRender();
  });
}

function destroyViewerSplit() {
  stopViewerSplitSync();
  setViewerSplitDragging(false);

  if (state.viewerSplit) {
    const sizes = state.viewerSplit.getSizes?.();
    if (Array.isArray(sizes) && sizes.length === 2) {
      state.viewerSplitSizes = sizes;
    }

    state.viewerSplit.destroy();
    state.viewerSplit = null;
  }

  clearViewerSplitStyles();
}

async function syncViewerSplitLayout() {
  if (!viewerSplitLayout) {
    return;
  }

  if (!shouldEnableViewerSplit()) {
    destroyViewerSplit();
    return;
  }

  if (state.viewerSplit) {
    state.viewerSplit.setSizes(state.viewerSplitSizes);
    scheduleViewerSplitSync();
    return;
  }

  try {
    await ensureSplitFactory();
    state.viewerSplit = state.splitFactory([mainViewerPanel, layerPanel], {
      sizes: state.viewerSplitSizes,
      minSize: [320, 240],
      gutterSize: 8,
      snapOffset: 0,
      elementStyle(dimension, size, gutterSize) {
        return {
          "flex-basis": `calc(${size}% - ${gutterSize}px)`,
        };
      },
      gutterStyle(dimension, gutterSize) {
        return {
          "flex-basis": `${gutterSize}px`,
        };
      },
      onDragStart: () => {
        stopViewerSplitSync();
        setViewerSplitDragging(true);
      },
      onDrag: () => {
        state.viewerSplitSizes = state.viewerSplit?.getSizes?.() || state.viewerSplitSizes;
      },
      onDragEnd: () => {
        setViewerSplitDragging(false);
        state.viewerSplitSizes = state.viewerSplit?.getSizes?.() || state.viewerSplitSizes;
        stopViewerSplitSync();
        syncModelViewerFrameHeight(true);
        resizeRenderer();
        queueRender();
      },
    });
  } catch (error) {
    console.error("Failed to load Split.js", error);
    destroyViewerSplit();
    return;
  }

  scheduleViewerSplitSync();
}

function getTargetModelViewerFrameHeight(isVoxelMode) {
  const mainPanelStyle = window.getComputedStyle(mainViewerPanel);
  const mainPanelPadding =
    Number.parseFloat(mainPanelStyle.paddingLeft) + Number.parseFloat(mainPanelStyle.paddingRight);
  const frameWidth = Math.max(0, mainViewerPanel.clientWidth - mainPanelPadding);
  const minHeight = isVoxelMode ? 520 : 400;
  const aspectRatio = isVoxelMode ? 0.92 : 1.55;

  return Math.max(minHeight, frameWidth / aspectRatio);
}

function syncModelViewerFrameHeight(isVoxelMode = modelViewMode.value === "voxel") {
  if (!modelViewerFrame) {
    return;
  }

  modelViewerFrame.style.height = `${getTargetModelViewerFrameHeight(isVoxelMode)}px`;
}

function setModelSwitchVisibility(isHidden) {
  if (modelCanvas.hidden) {
    return;
  }

  modelViewerFrame.classList.toggle("is-switching", isHidden);
}

function lockModelViewerFrameToCurrentState() {
  const frameRect = modelViewerFrame.getBoundingClientRect();
  const frameStyle = window.getComputedStyle(modelViewerFrame);

  modelViewerFrame.style.height = `${frameRect.height}px`;
  modelViewerFrame.style.opacity = frameStyle.opacity;
}

function finalizeViewModeTransition(transitionId, isVoxelMode = modelViewMode.value === "voxel") {
  if (transitionId !== state.viewModeTransitionId) {
    return;
  }

  stopFrameResizeAnimation();
  stopViewModeTransitionTimeout();
  syncModelViewerFrameHeight(isVoxelMode);
  resizeRenderer();
  queueRender();

  requestAnimationFrame(() => {
    if (transitionId !== state.viewModeTransitionId) {
      return;
    }

    modelLayout.classList.remove("delayed-layer-reveal");
    setModelSwitchVisibility(false);
    modelViewerFrame.style.opacity = "";
    queueRender();
  });
}

function animateModelViewerFrameLayout(startHeight, isVoxelMode) {
  stopFrameResizeAnimation();
  const targetHeight = getTargetModelViewerFrameHeight(isVoxelMode);

  if (Math.abs(targetHeight - startHeight) < 1) {
    return;
  }

  modelViewerFrame.style.height = `${startHeight}px`;

  requestAnimationFrame(() => {
    modelViewerFrame.style.height = `${targetHeight}px`;

    const syncRendererSize = () => {
      resizeRenderer();
      state.frameResizeAnimation = requestAnimationFrame(syncRendererSize);
    };

    syncRendererSize();
  });
}

function applyViewModeState(isVoxelMode) {
  const showLayerPanel = isVoxelMode && state.slideshowVisible;
  updateControlVisibility();
  modelLayout.classList.toggle("wireframe-active", !isVoxelMode);
  modelLayout.classList.toggle("slideshow-hidden", isVoxelMode && !state.slideshowVisible);
  layerPanel.setAttribute("aria-hidden", String(!showLayerPanel));
  void syncViewerSplitLayout();

  if (state.voxelMesh) {
    state.voxelMesh.visible = isVoxelMode;
  }

  if (state.selectedVoxelMesh) {
    state.selectedVoxelMesh.visible = isVoxelMode && Boolean(getSelectedEntry());
  }

  if (state.secondaryVoxelMesh) {
    const secondaryEntry = getSecondaryEntry();
    state.secondaryVoxelMesh.visible =
      isVoxelMode && Boolean(secondaryEntry) && getVoxelKey(secondaryEntry) !== state.selectedVoxelKey;
  }

  if (state.currentLayerMesh) {
    state.currentLayerMesh.visible = false;
  }

  if (state.wireframeGroup) {
    state.wireframeGroup.visible = !isVoxelMode;
  }

  if (state.wireframeFillGroup) {
    state.wireframeFillGroup.visible = !isVoxelMode && state.wireMeshVisible;
  }

  if (state.primaryWireframeHighlight) {
    state.primaryWireframeHighlight.visible =
      !isVoxelMode && Boolean(state.primaryWireframeLine);
  }

  if (state.secondaryWireframeHighlight) {
    state.secondaryWireframeHighlight.visible =
      !isVoxelMode && Boolean(state.secondaryWireframeLine);
  }

  updatePanelHighlights();
}

function syncViewMode(isVoxelMode = modelViewMode.value === "voxel") {
  stopFrameResizeAnimation();
  stopViewModeTransitionTimeout();
  modelLayout.classList.remove("delayed-layer-reveal");
  applyViewModeState(isVoxelMode);
  modelViewerFrame.classList.remove("is-switching");
  modelViewerFrame.style.opacity = "";
  syncModelViewerFrameHeight(isVoxelMode);
  renderLayerCanvas();
  resizeRenderer();
  queueRender();
}

function updateViewMode() {
  const isVoxelMode = modelViewMode.value === "voxel";
  const wasVoxelMode = !modelLayout.classList.contains("wireframe-active");
  const wasLayerVisible = wasVoxelMode && !modelLayout.classList.contains("slideshow-hidden");
  state.viewModeTransitionId += 1;
  const transitionId = state.viewModeTransitionId;
  stopViewModeTransitionTimeout();
  lockModelViewerFrameToCurrentState();
  const startHeight = modelViewerFrame.getBoundingClientRect().height;
  const willShowLayerPanel = isVoxelMode && state.slideshowVisible;

  if (willShowLayerPanel && !wasLayerVisible) {
    modelLayout.classList.add("delayed-layer-reveal");
    applyViewModeState(true);
    animateModelViewerFrameLayout(startHeight, true);
    state.viewModeTransitionTimeout = window.setTimeout(() => {
      finalizeViewModeTransition(transitionId, true);
    }, 360);
    renderLayerCanvas();
    queueRender();
    return;
  }

  requestAnimationFrame(() => {
    if (transitionId !== state.viewModeTransitionId) {
      return;
    }

    setModelSwitchVisibility(true);
  });

  applyViewModeState(isVoxelMode);
  animateModelViewerFrameLayout(startHeight, isVoxelMode);
  state.viewModeTransitionTimeout = window.setTimeout(() => {
    finalizeViewModeTransition(transitionId, isVoxelMode);
  }, 360);

  renderLayerCanvas();
  queueRender();
}

modelViewerFrame.addEventListener("transitionend", (event) => {
  if (event.propertyName !== "height") {
    return;
  }

  finalizeViewModeTransition(state.viewModeTransitionId);
});

modelLayout.addEventListener("transitionend", (event) => {
  if (event.target === layerPanel) {
    finalizeViewModeTransition(state.viewModeTransitionId);
  }
});

function handleWindowResize() {
  void syncViewerSplitLayout();
  stopFrameResizeAnimation();
  stopCameraMotion();
  syncModelViewerFrameHeight();
  modelViewerFrame.style.opacity = "";
  resizeRenderer();
  updateCamera({ immediate: true });
}

function disposeMaterial(material) {
  if (Array.isArray(material)) {
    for (const entry of material) {
      entry.map?.dispose();
      entry.dispose();
    }
    return;
  }

  material.map?.dispose();
  material.dispose();
}

function clearSceneModel(options = {}) {
  if (!state.scene) {
    return;
  }

  const { preserveSource = false } = options;

  if (state.voxelMesh) {
    state.scene.remove(state.voxelMesh);
    state.voxelMesh.geometry.dispose();
    disposeMaterial(state.voxelMesh.material);
    state.voxelMesh = null;
  }

  if (state.wireframeGroup) {
    state.scene.remove(state.wireframeGroup);
    for (const child of state.wireframeGroup.children) {
      child.geometry?.dispose();
      child.material?.dispose();
    }
    state.wireframeGroup = null;
  }

  if (state.wireframeFillGroup) {
    state.scene.remove(state.wireframeFillGroup);
    for (const child of state.wireframeFillGroup.children) {
      child.geometry?.dispose();
      child.material?.dispose();
    }
    state.wireframeFillGroup = null;
  }

  if (state.selectedVoxelMesh) {
    state.scene.remove(state.selectedVoxelMesh);
    state.selectedVoxelMesh.geometry.dispose();
    disposeMaterial(state.selectedVoxelMesh.material);
    state.selectedVoxelMesh = null;
  }

  if (state.secondaryVoxelMesh) {
    state.scene.remove(state.secondaryVoxelMesh);
    state.secondaryVoxelMesh.geometry.dispose();
    disposeMaterial(state.secondaryVoxelMesh.material);
    state.secondaryVoxelMesh = null;
  }

  if (state.currentLayerMesh) {
    state.scene.remove(state.currentLayerMesh);
    state.currentLayerMesh.geometry.dispose();
    disposeMaterial(state.currentLayerMesh.material);
    state.currentLayerMesh = null;
  }

  state.voxelEntries = [];
  state.voxelMinY = 0;
  state.voxelMaxY = 0;
  state.voxelMinX = 0;
  state.voxelMaxX = 0;
  state.voxelMinZ = 0;
  state.voxelMaxZ = 0;
  state.currentLayerY = 0;
  state.layerGridWidth = 0;
  state.layerGridDepth = 0;
  state.layerGridSize = 0;
  state.layerOffsetX = 0;
  state.layerOffsetZ = 0;
  clearPanelSelections();
  updateLayerControls();
  setLayerViewerState(false, "Upload a model to browse its voxel layers here.");

  if (!preserveSource) {
    disposeMeshCollection(state.sourceMeshes);
    disposeMeshCollection(state.originalSourceMeshes);
    state.sourceRoot = null;
    state.originalSourceMeshes = [];
    state.sourceMeshes = [];
    state.sourceSize = 1;
    state.selectedVoxelKey = null;
    state.selectedInstanceId = null;
    state.secondaryVoxelKey = null;
  }
}

function addEdgesFromIndices(indexArray, edgeSet) {
  for (let i = 0; i < indexArray.length; i += 3) {
    const a = indexArray[i];
    const b = indexArray[i + 1];
    const c = indexArray[i + 2];

    if (c === undefined) {
      continue;
    }

    edgeSet.add(a < b ? `${a}:${b}` : `${b}:${a}`);
    edgeSet.add(b < c ? `${b}:${c}` : `${c}:${b}`);
    edgeSet.add(c < a ? `${c}:${a}` : `${a}:${c}`);
  }
}

function parseOffToGeometry(text) {
  const THREE = state.three;
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  if (lines[0] !== "OFF") {
    throw new Error("This OFF file is missing a valid header.");
  }

  const [vertexCount, faceCount] = lines[1].split(/\s+/).map(Number);
  const positions = [];
  const indices = [];

  for (let i = 0; i < vertexCount; i += 1) {
    const [x, y, z] = lines[2 + i].split(/\s+/).map(Number);
    positions.push(x, y, z);
  }

  for (let i = 0; i < faceCount; i += 1) {
    const parts = lines[2 + vertexCount + i].split(/\s+/).map(Number);
    const count = parts[0];
    const faceIndices = parts.slice(1, 1 + count);

    for (let j = 1; j < faceIndices.length - 1; j += 1) {
      indices.push(faceIndices[0], faceIndices[j], faceIndices[j + 1]);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function buildBlockTextureCanvas(palette) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const size = 16;
  const border = 1;
  const inset = border;
  const center = (size - 1) / 2;
  const radius = size * 0.52;
  canvas.width = size;
  canvas.height = size;

  context.clearRect(0, 0, size, size);

  context.fillStyle = "#000000";
  context.fillRect(0, 0, size, size);

  const drawPixel = (x, y, color) => {
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  };

  const lerpColor = (fromHex, toHex, amount) => {
    const from = Number.parseInt(fromHex.slice(1), 16);
    const to = Number.parseInt(toHex.slice(1), 16);
    const fr = (from >> 16) & 255;
    const fg = (from >> 8) & 255;
    const fb = from & 255;
    const tr = (to >> 16) & 255;
    const tg = (to >> 8) & 255;
    const tb = to & 255;
    const r = Math.round(fr + (tr - fr) * amount);
    const g = Math.round(fg + (tg - fg) * amount);
    const b = Math.round(fb + (tb - fb) * amount);
    return `rgb(${r}, ${g}, ${b})`;
  };

  for (let y = inset; y < size - inset; y += 1) {
    for (let x = inset; x < size - inset; x += 1) {
      const dx = x - center;
      const dy = y - center;
      const distance = Math.sqrt(dx * dx + dy * dy) / radius;
      const edgeMix = Math.max(0, Math.min(1, distance));

      let color = lerpColor(palette.highlight, palette.base, Math.min(1, edgeMix * 1.15));
      if (edgeMix > 0.72) {
        color = lerpColor(palette.base, palette.shadow, Math.min(1, (edgeMix - 0.72) / 0.28));
      }

      drawPixel(x, y, color);
    }
  }

  for (let y = inset; y < size - inset; y += 1) {
    for (let x = inset; x < size - inset; x += 1) {
      if (x === inset || y === inset || x === size - inset - 1 || y === size - inset - 1) {
        drawPixel(x, y, palette.detail);
      }
    }
  }

  drawPixel(4, 4, "rgba(255, 255, 255, 0.35)");
  drawPixel(5, 4, "rgba(255, 255, 255, 0.2)");
  drawPixel(4, 5, "rgba(255, 255, 255, 0.2)");

  return canvas;
}

function createBlockTexture(THREE, palette) {
  const canvas = buildBlockTextureCanvas(palette);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createBlockMaterials(THREE, paletteSet) {
  const sideTexture = createBlockTexture(THREE, paletteSet.side);
  const topTexture = createBlockTexture(THREE, paletteSet.top);
  const bottomTexture = createBlockTexture(THREE, paletteSet.bottom);

  const materialFor = (texture) =>
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
      toneMapped: false,
    });

  return [
    materialFor(sideTexture),
    materialFor(sideTexture.clone()),
    materialFor(topTexture),
    materialFor(bottomTexture),
    materialFor(sideTexture.clone()),
    materialFor(sideTexture.clone()),
  ];
}

function ensureLayerTextures() {
  if (!state.layerTextureCanvas) {
    state.layerTextureCanvas = buildBlockTextureCanvas(LAYER_BLOCK_PALETTES.top);
  }

  if (!state.selectedLayerTextureCanvas) {
    state.selectedLayerTextureCanvas = buildBlockTextureCanvas(SELECTED_BLOCK_PALETTES.top);
  }

  if (!state.secondaryLayerTextureCanvas) {
    state.secondaryLayerTextureCanvas = buildBlockTextureCanvas(SECONDARY_BLOCK_PALETTES.top);
  }
}

async function ensureThree() {
  if (state.three) {
    return;
  }

  const THREE = await import("https://esm.sh/three@0.161.0");
  const [{ OBJLoader }, { STLLoader }, { PLYLoader }, { MeshSurfaceSampler }, { LineSegments2 }, { LineMaterial }, { LineSegmentsGeometry }, { OrbitControls }] = await Promise.all([
    import("https://esm.sh/three@0.161.0/examples/jsm/loaders/OBJLoader.js"),
    import("https://esm.sh/three@0.161.0/examples/jsm/loaders/STLLoader.js"),
    import("https://esm.sh/three@0.161.0/examples/jsm/loaders/PLYLoader.js"),
    import("https://esm.sh/three@0.161.0/examples/jsm/math/MeshSurfaceSampler.js"),
    import("https://esm.sh/three@0.161.0/examples/jsm/lines/LineSegments2.js"),
    import("https://esm.sh/three@0.161.0/examples/jsm/lines/LineMaterial.js"),
    import("https://esm.sh/three@0.161.0/examples/jsm/lines/LineSegmentsGeometry.js"),
    import("https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls.js"),
  ]);

  state.three = THREE;
  state.loaders = {
    obj: new OBJLoader(),
    stl: new STLLoader(),
    ply: new PLYLoader(),
    sampler: MeshSurfaceSampler,
    LineSegments2,
    LineMaterial,
    LineSegmentsGeometry,
    OrbitControls,
  };

  state.scene = new THREE.Scene();
  state.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);
  state.renderer = new THREE.WebGLRenderer({
    canvas: modelCanvas,
    antialias: true,
    alpha: true,
  });
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  state.renderer.outputColorSpace = THREE.SRGBColorSpace;
  state.raycaster = new THREE.Raycaster();
  state.orbitControls = new OrbitControls(state.camera, modelCanvas);
  state.orbitControls.enableDamping = true;
  state.orbitControls.dampingFactor = 0.08;
  state.orbitControls.rotateSpeed = 0.9;
  state.orbitControls.zoomSpeed = 0.85;
  state.orbitControls.panSpeed = 0.9;
  state.orbitControls.screenSpacePanning = true;
  state.orbitControls.enableZoom = true;
  state.orbitControls.minPolarAngle = 0.05;
  state.orbitControls.maxPolarAngle = Math.PI - 0.05;
  state.orbitControls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };
  state.orbitControls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };
  state.orbitControls.addEventListener("start", () => {
    state.dragging = true;
    state.dragDistance = 0;
    state.pointerDownAt = performance.now();
    startControlsAnimation();
  });
  state.orbitControls.addEventListener("change", () => {
    if (state.syncingOrbitControls) {
      return;
    }

    syncInputsFromCamera();
    queueRender();
  });
  state.orbitControls.addEventListener("end", () => {
    state.dragging = false;
    startControlsAnimation();
  });
  ensureLayerTextures();

  const ambient = new THREE.AmbientLight(0xffffff, 1.1);
  const keyLight = new THREE.DirectionalLight(0xfff1de, 0.9);
  keyLight.position.set(5, 7, 6);
  const fillLight = new THREE.DirectionalLight(0xc28a58, 0.45);
  fillLight.position.set(-4, 2, -6);

  state.scene.add(ambient, keyLight, fillLight);

  const createWireframeHighlight = (color) => {
    const geometry = new state.loaders.LineSegmentsGeometry();
    geometry.setPositions([0, 0, 0, 0, 0, 0]);
    const material = new state.loaders.LineMaterial({
      color,
      linewidth: DEFAULT_VIEW.wireSize + 1,
      transparent: true,
      opacity: 1,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    material.resolution.set(modelCanvas.clientWidth || 1, modelCanvas.clientHeight || 1);
    const line = new state.loaders.LineSegments2(geometry, material);
    line.visible = false;
    line.renderOrder = 10;
    state.scene.add(line);
    return line;
  };

  state.primaryWireframeHighlight = createWireframeHighlight(0x2f80ed);
  state.secondaryWireframeHighlight = createWireframeHighlight(0x8f3f16);
  state.primaryPanelHighlight = new THREE.Mesh(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
    new THREE.MeshBasicMaterial({
      color: 0x2f80ed,
      transparent: true,
      opacity: 0.72,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    })
  );
  state.primaryPanelHighlight.visible = false;
  state.primaryPanelHighlight.renderOrder = 12;
  state.scene.add(state.primaryPanelHighlight);
  state.secondaryPanelHighlight = new THREE.Mesh(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
    new THREE.MeshBasicMaterial({
      color: 0x8f3f16,
      transparent: true,
      opacity: 0.72,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    })
  );
  state.secondaryPanelHighlight.visible = false;
  state.secondaryPanelHighlight.renderOrder = 12;
  state.scene.add(state.secondaryPanelHighlight);

  resizeRenderer();
  updateCamera({ immediate: true });
  queueRender();
}

async function loadModelRoot(arrayBuffer, fileName) {
  await ensureThree();

  const THREE = state.three;
  const extension = fileName.toLowerCase().split(".").pop();
  let root = new THREE.Group();

  if (extension === "obj") {
    const text = new TextDecoder().decode(arrayBuffer);
    root = state.loaders.obj.parse(text);
  } else if (extension === "stl") {
    const geometry = state.loaders.stl.parse(arrayBuffer);
    root.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial()));
  } else if (extension === "ply") {
    const geometry = state.loaders.ply.parse(arrayBuffer);
    geometry.computeVertexNormals();
    root.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial()));
  } else if (extension === "off") {
    const text = new TextDecoder().decode(arrayBuffer);
    root.add(new THREE.Mesh(parseOffToGeometry(text), new THREE.MeshStandardMaterial()));
  } else {
    throw new Error("Supported formats are OBJ, STL, OFF, and PLY.");
  }

  root.updateMatrixWorld(true);

  const sourceMeshes = [];
  let totalVertices = 0;
  const edgeSet = new Set();

  root.traverse((child) => {
    if (!child.isMesh || !child.geometry?.attributes?.position) {
      return;
    }

    const geometry = child.geometry.clone();
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    mesh.applyMatrix4(child.matrixWorld);
    sourceMeshes.push(mesh);

    totalVertices += geometry.attributes.position.count;

    if (geometry.index) {
      addEdgesFromIndices(geometry.index.array, edgeSet);
    } else {
      const indices = Array.from({ length: geometry.attributes.position.count }, (_, index) => index);
      addEdgesFromIndices(indices, edgeSet);
    }
  });

  if (sourceMeshes.length === 0) {
    throw new Error("No supported mesh geometry was found in this model.");
  }

  const combinedBounds = new THREE.Box3();
  for (const mesh of sourceMeshes) {
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox.clone();
    box.applyMatrix4(mesh.matrixWorld);
    combinedBounds.union(box);
  }

  const center = combinedBounds.getCenter(new THREE.Vector3());
  const sizeVector = combinedBounds.getSize(new THREE.Vector3());
  const size = Math.max(sizeVector.x, sizeVector.y, sizeVector.z) || 1;

  for (const mesh of sourceMeshes) {
    mesh.position.sub(center);
    mesh.updateMatrixWorld(true);
  }

  return {
    meshes: sourceMeshes,
    vertices: totalVertices,
    edges: edgeSet.size,
    size,
  };
}

function buildVoxelEntries() {
  const THREE = state.three;
  const voxelSet = new Set();
  const quality = normalizeQualityValue(modelQualityNumber.value);
  const voxelSize = Math.max(state.sourceSize / quality, 0.0001);

  for (const mesh of state.sourceMeshes) {
    const triangleGeometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry;
    const position = mesh.geometry.attributes.position;
    const trianglePosition = triangleGeometry.attributes.position;
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const point = new THREE.Vector3();

    for (let index = 0; index < position.count; index += 1) {
      point.fromBufferAttribute(position, index).applyMatrix4(mesh.matrixWorld);
      addVoxelPoint(voxelSet, point, voxelSize);
    }

    for (let index = 0; index < trianglePosition.count; index += 3) {
      a.fromBufferAttribute(trianglePosition, index).applyMatrix4(mesh.matrixWorld);
      b.fromBufferAttribute(trianglePosition, index + 1).applyMatrix4(mesh.matrixWorld);
      c.fromBufferAttribute(trianglePosition, index + 2).applyMatrix4(mesh.matrixWorld);
      addTriangleVoxels(voxelSet, a, b, c, voxelSize);
    }

    if (triangleGeometry !== mesh.geometry) {
      triangleGeometry.dispose();
    }
  }

  fillVoxelInterior(voxelSet);

  state.voxelEntries = [...voxelSet].map((key, instanceId) => {
    const [x, y, z] = key.split(":").map(Number);
    return { x, y, z, instanceId };
  });
  const selectedEntry = getSelectedEntry();
  state.selectedInstanceId = selectedEntry ? selectedEntry.instanceId : null;

  if (!selectedEntry) {
    state.selectedVoxelKey = null;
  }

  if (!getSecondaryEntry()) {
    state.secondaryVoxelKey = null;
  }

  state.voxelMinY = state.voxelEntries.reduce(
    (minimum, entry) => Math.min(minimum, entry.y),
    Number.POSITIVE_INFINITY
  );

  if (!Number.isFinite(state.voxelMinY)) {
    state.voxelMinY = 0;
  }

  state.voxelMaxY = state.voxelEntries.reduce((maximum, entry) => Math.max(maximum, entry.y), state.voxelMinY);
  state.voxelMinX = state.voxelEntries.reduce((minimum, entry) => Math.min(minimum, entry.x), Number.POSITIVE_INFINITY);
  state.voxelMaxX = state.voxelEntries.reduce((maximum, entry) => Math.max(maximum, entry.x), Number.NEGATIVE_INFINITY);
  state.voxelMinZ = state.voxelEntries.reduce((minimum, entry) => Math.min(minimum, entry.z), Number.POSITIVE_INFINITY);
  state.voxelMaxZ = state.voxelEntries.reduce((maximum, entry) => Math.max(maximum, entry.z), Number.NEGATIVE_INFINITY);

  if (!Number.isFinite(state.voxelMinX)) {
    state.voxelMinX = 0;
    state.voxelMaxX = 0;
    state.voxelMinZ = 0;
    state.voxelMaxZ = 0;
  }

  state.currentLayerY = state.voxelMinY;
  clearPanelSelections();

  if (state.wireframeGroup) {
    state.scene.remove(state.wireframeGroup);
    for (const child of state.wireframeGroup.children) {
      child.geometry?.dispose();
      child.material?.dispose();
    }
  }

  if (state.wireframeFillGroup) {
    state.scene.remove(state.wireframeFillGroup);
    for (const child of state.wireframeFillGroup.children) {
      child.geometry?.dispose();
      child.material?.dispose();
    }
  }

  state.wireframeGroup = new THREE.Group();
  state.wireframeFillGroup = new THREE.Group();
  const initialWireSize = (Number(modelWireSize.value) || DEFAULT_VIEW.wireSize) / 10;
  for (const mesh of state.sourceMeshes) {
    const fillGeometry = mesh.geometry.clone();
    fillGeometry.computeVertexNormals();
    const fillMaterial = new THREE.MeshStandardMaterial({
      color: modelColor.value || DEFAULT_VIEW.modelColor,
      roughness: 0.78,
      metalness: 0.02,
      transparent: false,
      opacity: 1,
      side: THREE.DoubleSide,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
    fillMesh.position.copy(mesh.position);
    fillMesh.rotation.copy(mesh.rotation);
    fillMesh.scale.copy(mesh.scale);
    fillMesh.renderOrder = 0;
    fillMesh.updateMatrixWorld(true);
    state.wireframeFillGroup.add(fillMesh);

    const wireGeometry = new THREE.WireframeGeometry(mesh.geometry);
    const wireSegmentsGeometry = new state.loaders.LineSegmentsGeometry();
    wireSegmentsGeometry.setPositions(Array.from(wireGeometry.attributes.position.array));
    const wireMaterial = new state.loaders.LineMaterial({
      color: 0x3a2617,
      transparent: true,
      opacity: 1,
      linewidth: initialWireSize,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    });
    wireMaterial.resolution.set(modelCanvas.clientWidth || 1, modelCanvas.clientHeight || 1);
    const wireframe = new state.loaders.LineSegments2(wireSegmentsGeometry, wireMaterial);
    wireframe.position.copy(mesh.position);
    wireframe.rotation.copy(mesh.rotation);
    wireframe.scale.copy(mesh.scale);
    wireframe.userData.segmentPositions = wireGeometry.attributes.position;
    wireframe.renderOrder = 5;
    wireframe.updateMatrixWorld(true);
    state.wireframeGroup.add(wireframe);
  }
  state.wireframeFillGroup.visible = modelViewMode.value === "wireframe";
  state.scene.add(state.wireframeFillGroup);
  state.wireframeGroup.visible = modelViewMode.value === "wireframe";
  state.scene.add(state.wireframeGroup);
  updateModelColor();
  updateWireframeAppearance();

  const geometry = new THREE.BoxGeometry(voxelSize * 0.96, voxelSize * 0.96, voxelSize * 0.96);
  const material = createBlockMaterials(THREE, BLOCK_PALETTES);
  const instanced = new THREE.InstancedMesh(geometry, material, state.voxelEntries.length);
  const matrix = new THREE.Matrix4();

  for (const entry of state.voxelEntries) {
    matrix.makeTranslation(entry.x * voxelSize, entry.y * voxelSize, entry.z * voxelSize);
    instanced.setMatrixAt(entry.instanceId, matrix);
  }

  instanced.instanceMatrix.needsUpdate = true;
  instanced.userData.voxelSize = voxelSize;
  state.voxelMesh = instanced;
  state.scene.add(instanced);

  const selectedGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
  const selectedMaterial = createBlockMaterials(THREE, SELECTED_BLOCK_PALETTES);
  state.selectedVoxelMesh = new THREE.Mesh(selectedGeometry, selectedMaterial);
  state.selectedVoxelMesh.visible = false;
  state.scene.add(state.selectedVoxelMesh);

  const secondaryGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
  const secondaryMaterial = createBlockMaterials(THREE, SECONDARY_BLOCK_PALETTES);
  state.secondaryVoxelMesh = new THREE.Mesh(secondaryGeometry, secondaryMaterial);
  state.secondaryVoxelMesh.visible = false;
  state.scene.add(state.secondaryVoxelMesh);

  const currentLayerGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
  const currentLayerMaterial = createBlockMaterials(THREE, LAYER_BLOCK_PALETTES);
  state.currentLayerMesh = new THREE.InstancedMesh(
    currentLayerGeometry,
    currentLayerMaterial,
    state.voxelEntries.length
  );
  state.currentLayerMesh.count = 0;
  state.currentLayerMesh.visible = false;
  state.scene.add(state.currentLayerMesh);

  updateSelectedVoxelMesh();
  updateSecondaryVoxelMesh();
  syncViewMode();
}

async function applyModel(arrayBuffer, fileName) {
  await ensureThree();
  clearSceneModel();

  const loaded = await loadModelRoot(arrayBuffer, fileName);
  state.originalSourceMeshes = loaded.meshes;
  state.sourceMeshes = buildWorkingSourceMeshes();
  state.sourceSize = loaded.size;
  state.selectedInstanceId = null;
  state.targetX = 0;
  state.targetY = 0;
  state.targetZ = 0;
  state.currentTargetX = 0;
  state.currentTargetY = 0;
  state.currentTargetZ = 0;
  clearPanelSelections();

  setModelUploadName(fileName);
  setSelectedBlock(null);
  setViewerState(true, "Loading model...");
  resizeRenderer();

  buildVoxelEntries();
  resizeRenderer();
  updateCamera({ immediate: true });
  setViewerState(true, "Model loaded");
  queueRender();
}

async function handleModelUpload(file) {
  if (!/\.(obj|stl|off|ply)$/i.test(file.name)) {
    setSelectedBlock(null);
    setModelUploadName("Unsupported file");
    modelEmptyState.textContent = "Please upload an `.obj`, `.stl`, `.off`, or `.ply` file.";
    setViewerState(false, "Supported formats are OBJ, STL, OFF, and PLY");
    modelUpload.value = "";
    return;
  }

  setModelUploadName(`Loading ${file.name}...`);
  setStatus("Loading model...");

  const arrayBuffer = await file.arrayBuffer();

  try {
    await applyModel(arrayBuffer, file.name);
  } catch (error) {
    clearSceneModel();
    setSelectedBlock(null);
    setModelUploadName("Model failed to load");
    modelEmptyState.textContent = error.message;
    setViewerState(false, error.message);
  } finally {
    modelUpload.value = "";
  }
}

function pickVoxel(clientX, clientY) {
  if (!state.voxelMesh || !state.renderer || !state.camera) {
    return null;
  }

  const rect = modelCanvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;

  state.raycaster.setFromCamera({ x, y }, state.camera);
  const intersections = state.raycaster.intersectObject(state.voxelMesh, false);
  const hit = intersections[0];

  if (!hit || hit.instanceId == null) {
    return null;
  }

  return state.voxelEntries[hit.instanceId] || null;
}

function pickLayerVoxel(clientX, clientY) {
  if (!state.voxelEntries.length || layerCanvas.hidden) {
    return null;
  }

  const rect = layerCanvas.getBoundingClientRect();
  const gridX = Math.floor(((clientX - rect.left) / rect.width) * state.layerGridSize);
  const gridZFromTop = Math.floor(((clientY - rect.top) / rect.height) * state.layerGridSize);
  const x = gridX - state.layerOffsetX;
  const zFromTop = gridZFromTop - state.layerOffsetZ;

  if (x < 0 || zFromTop < 0 || x >= state.layerGridWidth || zFromTop >= state.layerGridDepth) {
    return null;
  }

  const worldX = state.voxelMaxX - x;
  const worldZ = state.voxelMaxZ - zFromTop;
  return (
    state.voxelEntries.find(
      (entry) => entry.x === worldX && entry.y === state.currentLayerY && entry.z === worldZ
    ) || null
  );
}

function pickWireframeLine(clientX, clientY) {
  if (!state.wireframeGroup || !state.renderer || !state.camera) {
    return null;
  }

  const rect = modelCanvas.getBoundingClientRect();
  const cameraPosition = new state.three.Vector3();
  state.camera.getWorldPosition(cameraPosition);
  const normalizedX = ((clientX - rect.left) / rect.width) * 2 - 1;
  const normalizedY = -((clientY - rect.top) / rect.height) * 2 + 1;
  state.raycaster.setFromCamera({ x: normalizedX, y: normalizedY }, state.camera);
  const occlusionDistance =
    state.wireMeshVisible && state.wireframeFillGroup?.visible
      ? state.raycaster.intersectObject(state.wireframeFillGroup, true)[0]?.distance ??
        Number.POSITIVE_INFINITY
      : Number.POSITIVE_INFINITY;
  const occlusionTolerance = Math.max(0.04, state.sourceSize * 0.012);
  const pointX = clientX - rect.left;
  const pointY = clientY - rect.top;
  const maxDistance = Math.max(12, (Number(modelWireSize.value) || DEFAULT_VIEW.wireSize) * 18);
  const maxDistanceSquared = maxDistance * maxDistance;
  let bestRayDistance = Number.POSITIVE_INFINITY;
  let bestDepth = Number.POSITIVE_INFINITY;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestLine = null;

  const getSegmentProjection = (pointX, pointY, startX, startY, endX, endY) => {
    const segmentX = endX - startX;
    const segmentY = endY - startY;
    const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

    if (segmentLengthSquared <= 1e-6) {
      const dx = pointX - startX;
      const dy = pointY - startY;
      return {
        projection: 0,
        distanceSquared: dx * dx + dy * dy,
      };
    }

    const projection = clamp(
      ((pointX - startX) * segmentX + (pointY - startY) * segmentY) / segmentLengthSquared,
      0,
      1
    );
    const nearestX = startX + segmentX * projection;
    const nearestY = startY + segmentY * projection;
    const dx = pointX - nearestX;
    const dy = pointY - nearestY;
    return {
      projection,
      distanceSquared: dx * dx + dy * dy,
    };
  };

  for (const wireframe of state.wireframeGroup.children) {
    const positions = wireframe.userData.segmentPositions;

    if (!positions) {
      continue;
    }

    for (let index = 0; index < positions.count; index += 2) {
      const worldStart = new state.three.Vector3().fromBufferAttribute(positions, index);
      const worldEnd = new state.three.Vector3().fromBufferAttribute(positions, index + 1);
      worldStart.applyMatrix4(wireframe.matrixWorld);
      worldEnd.applyMatrix4(wireframe.matrixWorld);

      const projectedStart = worldStart.clone().project(state.camera);
      const projectedEnd = worldEnd.clone().project(state.camera);

      if (
        !Number.isFinite(projectedStart.x) ||
        !Number.isFinite(projectedStart.y) ||
        !Number.isFinite(projectedStart.z) ||
        !Number.isFinite(projectedEnd.x) ||
        !Number.isFinite(projectedEnd.y) ||
        !Number.isFinite(projectedEnd.z)
      ) {
        continue;
      }

      const isStartVisible = projectedStart.z >= -1 && projectedStart.z <= 1;
      const isEndVisible = projectedEnd.z >= -1 && projectedEnd.z <= 1;

      if (!isStartVisible && !isEndVisible) {
        continue;
      }

      const startX = ((projectedStart.x + 1) * 0.5) * rect.width;
      const startY = ((1 - projectedStart.y) * 0.5) * rect.height;
      const endX = ((projectedEnd.x + 1) * 0.5) * rect.width;
      const endY = ((1 - projectedEnd.y) * 0.5) * rect.height;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) < 1e-6 && Math.abs(deltaY) < 1e-6) {
        continue;
      }

      const { projection, distanceSquared } = getSegmentProjection(
        pointX,
        pointY,
        startX,
        startY,
        endX,
        endY
      );

      if (distanceSquared > maxDistanceSquared) {
        continue;
      }

      const nearestPoint = worldStart.clone().lerp(worldEnd, projection);
      const rayDistance = state.raycaster.ray.distanceSqToPoint(nearestPoint);
      const rayDepth = nearestPoint.clone().sub(state.raycaster.ray.origin).dot(state.raycaster.ray.direction);
      const depth = nearestPoint.distanceToSquared(cameraPosition);

      if (
        !Number.isFinite(rayDepth) ||
        rayDepth < 0 ||
        rayDepth > occlusionDistance + occlusionTolerance
      ) {
        continue;
      }

      if (
        rayDistance > bestRayDistance + 1e-4 ||
        (Math.abs(rayDistance - bestRayDistance) <= 1e-4 && depth > bestDepth + 1e-4) ||
        (Math.abs(rayDistance - bestRayDistance) <= 1e-4 &&
          Math.abs(depth - bestDepth) <= 1e-4 &&
          distanceSquared >= bestDistance)
      ) {
        continue;
      }

      bestRayDistance = rayDistance;
      bestDepth = depth;
      bestDistance = distanceSquared;
      bestLine = {
        angle: ((Math.atan2(-deltaY, deltaX) * 180) / Math.PI + 360) % 180,
        start: worldStart.clone(),
        end: worldEnd.clone(),
      };
    }
  }

  return bestLine;
}

function computeTriangleAngle(opposite, first, second) {
  const denominator = 2 * first * second;

  if (denominator <= 1e-8) {
    return 0;
  }

  const ratio = clamp((first * first + second * second - opposite * opposite) / denominator, -1, 1);
  return (Math.acos(ratio) * 180) / Math.PI;
}

function buildPanelSelection(intersection) {
  const position = intersection.object.geometry?.attributes?.position;
  const face = intersection.face;

  if (!position || !face) {
    return null;
  }

  const a = new state.three.Vector3().fromBufferAttribute(position, face.a).applyMatrix4(intersection.object.matrixWorld);
  const b = new state.three.Vector3().fromBufferAttribute(position, face.b).applyMatrix4(intersection.object.matrixWorld);
  const c = new state.three.Vector3().fromBufferAttribute(position, face.c).applyMatrix4(intersection.object.matrixWorld);
  const ab = a.distanceTo(b);
  const bc = b.distanceTo(c);
  const ca = c.distanceTo(a);
  const normal = new state.three.Vector3().crossVectors(
    b.clone().sub(a),
    c.clone().sub(a)
  ).normalize();

  return {
    key: `${intersection.object.uuid}:${intersection.faceIndex}`,
    faceIndex: intersection.faceIndex ?? 0,
    vertices: [a, b, c],
    normal,
    lengths: { ab, bc, ca },
    angles: {
      a: computeTriangleAngle(bc, ab, ca),
      b: computeTriangleAngle(ca, ab, bc),
      c: computeTriangleAngle(ab, bc, ca),
    },
  };
}

function pickWireframePanel(clientX, clientY) {
  if (!state.wireframeFillGroup || !state.renderer || !state.camera) {
    return null;
  }

  const rect = modelCanvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  state.raycaster.setFromCamera({ x, y }, state.camera);
  const hit = state.raycaster.intersectObject(state.wireframeFillGroup, true)[0];
  return hit ? buildPanelSelection(hit) : null;
}

pickModelButton.addEventListener("click", () => {
  modelUpload.click();
});

modelUpload.addEventListener("change", (event) => {
  const [file] = event.target.files;

  if (file) {
    handleModelUpload(file);
  }
});

modelZoom.addEventListener("input", () => {
  updateControlLabels();
  updateCamera();
});

modelYaw.addEventListener("input", () => {
  updateControlLabels();
  updateCamera();
});

modelPitch.addEventListener("input", () => {
  updateControlLabels();
  updateCamera();
});

modelWireSize.addEventListener("input", () => {
  updateControlLabels();
  updateWireframeAppearance();
});

modelColor.addEventListener("input", () => {
  updateControlLabels();
  updateModelColor();
});

modelQuality.addEventListener("input", () => {
  syncQualityControls(modelQuality.value);
  rebuildVoxelPreview();
});

modelQualityNumber.addEventListener("input", () => {
  const quality = Number(modelQualityNumber.value);

  if (!Number.isFinite(quality) || quality < QUALITY_MIN || quality > QUALITY_MAX) {
    return;
  }

  syncQualityControls(quality);
  rebuildVoxelPreview();
});

modelQualityNumber.addEventListener("change", () => {
  syncQualityControls(modelQualityNumber.value);
  rebuildVoxelPreview();
});

modelViewMode.addEventListener("input", () => {
  updateViewMode();
});

toggleSlideshowButton.addEventListener("click", () => {
  state.slideshowVisible = !state.slideshowVisible;
  updateSlideshowToggleLabel();
  updateViewMode();
});

toggleWireMeshButton.addEventListener("click", () => {
  state.wireMeshVisible = !state.wireMeshVisible;
  updateWireMeshToggleLabel();
  applyViewModeState(modelViewMode.value === "voxel");
  queueRender();
});

toggleFullscreenButton.addEventListener("click", async () => {
  if (document.fullscreenElement === modelViewerFrame) {
    await document.exitFullscreen();
    return;
  }

  await modelViewerFrame.requestFullscreen();
});

layerPrevButton.addEventListener("click", () => {
  if (!state.voxelEntries.length) {
    return;
  }

  state.currentLayerY = clamp(state.currentLayerY - 1, state.voxelMinY, state.voxelMaxY);
  renderLayerCanvas();
});

layerNextButton.addEventListener("click", () => {
  if (!state.voxelEntries.length) {
    return;
  }

  state.currentLayerY = clamp(state.currentLayerY + 1, state.voxelMinY, state.voxelMaxY);
  renderLayerCanvas();
});

layerJumpButton.addEventListener("click", () => {
  const selectedEntry = getSelectedEntry();

  if (!selectedEntry) {
    return;
  }

  state.currentLayerY = selectedEntry.y;
  renderLayerCanvas();
});

layerSecondaryJumpButton.addEventListener("click", () => {
  const secondaryEntry = getSecondaryEntry();

  if (!secondaryEntry) {
    return;
  }

  state.currentLayerY = secondaryEntry.y;
  renderLayerCanvas();
});

resetViewButton.addEventListener("click", () => {
  modelZoom.value = DEFAULT_VIEW.zoom;
  modelYaw.value = DEFAULT_VIEW.yaw;
  modelPitch.value = DEFAULT_VIEW.pitch;
  modelWireSize.value = DEFAULT_VIEW.wireSize;
  modelColor.value = DEFAULT_VIEW.modelColor;
  syncQualityControls(DEFAULT_VIEW.quality);
  state.targetX = 0;
  state.targetY = 0;
  state.targetZ = 0;
  updateControlLabels();

  if (state.originalSourceMeshes.length) {
    rebuildModelFromSourceMeshes();
  }

  updateCamera({ immediate: true });
});

modelCanvas.addEventListener("pointerdown", (event) => {
  state.dragDistance = 0;
  state.pointerDownAt = performance.now();
  state.dragStart = {
    x: event.clientX,
    y: event.clientY,
    button: event.button,
  };
});

modelCanvas.addEventListener("pointermove", (event) => {
  if (!state.dragStart) {
    return;
  }

  const deltaX = event.clientX - state.dragStart.x;
  const deltaY = event.clientY - state.dragStart.y;
  state.dragDistance = Math.max(state.dragDistance, Math.hypot(deltaX, deltaY));
});

function stopDragging(event) {
  state.dragStart = null;
}

modelCanvas.addEventListener("pointerup", stopDragging);
modelCanvas.addEventListener("pointercancel", stopDragging);

modelCanvas.addEventListener("click", (event) => {
  if (state.dragDistance > 6 || performance.now() - state.pointerDownAt > MAX_CLICK_HOLD_MS) {
    state.dragDistance = 0;
    return;
  }

  if (modelViewMode.value === "wireframe") {
    const panel = pickWireframePanel(event.clientX, event.clientY);
    setPrimaryPanel(panel);
    return;
  }

  if (modelViewMode.value !== "voxel") {
    return;
  }

  const picked = pickVoxel(event.clientX, event.clientY);
  setSelectedBlock(picked);
  state.dragDistance = 0;
});

modelCanvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();

  if (modelViewMode.value === "wireframe") {
    if (state.dragDistance > 6 || performance.now() - state.pointerDownAt > MAX_CLICK_HOLD_MS) {
      state.dragDistance = 0;
      return;
    }

    const panel = pickWireframePanel(event.clientX, event.clientY);
    setSecondaryPanel(panel);
    return;
  }

  if (modelViewMode.value !== "voxel") {
    return;
  }

  if (state.dragDistance > 6) {
    state.dragDistance = 0;
    return;
  }

  const picked = pickVoxel(event.clientX, event.clientY);
  setSecondaryBlock(picked);
});

modelCanvas.addEventListener("wheel", (event) => {
  startControlsAnimation();
});

layerCanvas.addEventListener("click", (event) => {
  const picked = pickLayerVoxel(event.clientX, event.clientY);
  setSelectedBlock(picked);
});

layerCanvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const picked = pickLayerVoxel(event.clientX, event.clientY);
  setSecondaryBlock(picked);
});

window.addEventListener("resize", handleWindowResize);
document.addEventListener("fullscreenchange", () => {
  updateFullscreenLabel();
  handleWindowResize();
});

updateControlLabels();
updateSlideshowToggleLabel();
updateWireMeshToggleLabel();
updateFullscreenLabel();
setSelectedBlock(null);
setSecondaryBlock(null);
resetWireframeAngle();
clearPanelSelections();
setModelUploadName("No model selected");
setViewerState(false, "Waiting for a model");
setLayerViewerState(false, "Upload a model to browse its voxel layers here.");
updateViewMode();
updateLayerControls();
ensureThree().catch((error) => {
  setViewerState(false, "Failed to load the 3D framework");
  modelEmptyState.textContent = error.message;
});
