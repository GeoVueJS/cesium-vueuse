<script setup lang="ts">
import { useCesiumFps } from '@cesium-vueuse/core';

const { fps, interval } = useCesiumFps({ delay: 300 });
</script>

<template>
  <div
    position="absolute top-0 right-0"
    bg="[var(--vp-c-bg)]"
    w="200px"
    p="10px"
    flex="~ col"
  >
    <span>FPS:{{ fps }}</span>
    <span>Interval:{{ interval }}ms</span>
  </div>
</template>
