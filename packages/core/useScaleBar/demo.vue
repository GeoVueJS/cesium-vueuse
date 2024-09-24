<script setup lang="ts">
import { useScaleBar } from '@cesium-vueuse/core';

const { pixelDistance, width, distance, distanceText } = useScaleBar();
</script>

<template>
  <div
    position="absolute left-0 bottom-0 right-0"
    bg="[var(--vp-c-bg)]"
    p="10px"
    flex="~ col"
  >
    <div>pixelDistance: {{ pixelDistance }}</div>
    <div>distance: {{ distance }}</div>
    <div b-b="#666 2px" :style="{ width: `${width}px` }">
      {{ distanceText }}
    </div>
  </div>
</template>
