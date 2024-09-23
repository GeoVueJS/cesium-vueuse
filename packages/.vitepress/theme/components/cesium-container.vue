<script lang="ts" setup>
import { createViewer } from '@cesium-vueuse/core';
import { shallowRef } from 'vue';
import 'cesium/Build/Cesium/Widgets/widgets.css';

defineOptions({ name: 'CesiumContainer' });

const elRef = shallowRef<HTMLElement>();
createViewer(elRef, {
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
</script>

<template>
  <div ref="elRef" class="position-absolute inset-0" />
  <slot />
</template>
