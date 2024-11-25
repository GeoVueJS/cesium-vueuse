<script setup lang="ts">
import { createViewer, useCesiumEventListener, useImageryLayer } from '@cesium-vueuse/core';
import { Cartesian3, ImageryLayer, Ion, IonImageryProvider, Matrix4, ScreenSpaceEventType, Transforms } from 'cesium';
import { useTemplateRef, watchEffect } from 'vue';
import 'cesium/Build/Cesium/Widgets/widgets.css';

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxM2QxOTZmOC00NGEwLTRjOTMtODUzYi03ZmM3MmFhMDhmYjEiLCJpZCI6ODUxMDcsImlhdCI6MTcyNTI3NjU4NH0.ZmrKQrRWFRCQLRSUEuPvVa6kFYvJ_3othkPumVfvQmU';

const elRef = useTemplateRef('elRef');
const viewer = createViewer(elRef, {
  animation: false,
  timeline: false,
  infoBox: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  creditContainer: document.createElement('div'),
  shouldAnimate: true,
  baseLayer: ImageryLayer.fromProviderAsync(IonImageryProvider.fromAssetId(3954), { nightAlpha: 0 }),
});

useImageryLayer(() => ImageryLayer.fromProviderAsync(IonImageryProvider.fromAssetId(3812), { dayAlpha: 0, brightness: 2 }));

watchEffect(() => {
  if (viewer.value) {
    viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
    viewer.value.clock.multiplier = 1000;
    // viewer.value.scene.screenSpaceCameraController.enableZoom = false;
    // viewer.value.scene.screenSpaceCameraController.enableTranslate = false;
    viewer.value.scene.globe.enableLighting = true;
  }
});

useCesiumEventListener(() => viewer.value?.scene.postUpdate, () => {
  const matrix = Transforms.computeIcrfToFixedMatrix(viewer.value!.clock.currentTime);
  if (!matrix) {
    return;
  }
  const camera = viewer.value!.camera;
  const offset = Cartesian3.clone(camera.position);
  const transform = Matrix4.fromRotationTranslation(matrix);
  camera.lookAtTransform(transform, offset);
});
</script>

<template>
  <teleport to="body">
    <div
      ref="elRef"
      position="fixed inset-0"
      b="1px #000"
      of="hidden"
      z--1
    />
  </teleport>
</template>
