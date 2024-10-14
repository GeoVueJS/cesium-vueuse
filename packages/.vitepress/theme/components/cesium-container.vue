<script lang="ts" setup>
import { createViewer } from '@cesium-vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { shallowRef, watchEffect } from 'vue';
import 'cesium/Build/Cesium/Widgets/widgets.css';

defineOptions({ name: 'CesiumContainer' });

const elRef = shallowRef<HTMLElement>();
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
});
watchEffect(() => {
  if (viewer.value) {
    viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
  }
});
</script>

<template>
  <div ref="elRef" class="position-absolute inset-0" />
  <slot />
</template>
