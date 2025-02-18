<script setup lang="ts">
import { useScaleBar, useViewer } from '@vesium/core';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';

const viewer = useViewer();
watchEffect(() => {
  viewer.value?.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(100, 0, 10000),
    duration: 3,

  });
});
const { pixelDistance, width, distance, distanceText } = useScaleBar();
</script>

<template>
  <div
    position="absolute top-0 right-0"
    bg="[var(--vp-c-bg)]"
    w="200px"
    p="10px"
    flex="~ col"
  >
    <div>pixelDistance: {{ pixelDistance }}m</div>
    <div>distance: {{ distance }}m</div>
    <div b-b="#666 2px" :style="{ width: `${width}px` }">
      {{ distanceText }}
    </div>
  </div>
</template>
