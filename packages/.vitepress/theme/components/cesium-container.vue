<script lang="ts" setup>
import { createViewer } from '@cesium-vueuse/core';
import * as Cesium from 'cesium';
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

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxM2QxOTZmOC00NGEwLTRjOTMtODUzYi03ZmM3MmFhMDhmYjEiLCJpZCI6ODUxMDcsImlhdCI6MTcyNTI3NjU4NH0.ZmrKQrRWFRCQLRSUEuPvVa6kFYvJ_3othkPumVfvQmU';
</script>

<template>
  <div ref="elRef" class="position-absolute inset-0" />
  <slot />
</template>
