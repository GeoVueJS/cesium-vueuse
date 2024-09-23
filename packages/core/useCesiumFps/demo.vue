<script setup lang="ts">
import { useCesiumFps } from '@cesium-vueuse/core';

const { fps, interval } = useCesiumFps({ delay: 300 });
</script>

<template>
  <div
    position="absolute left-0 bottom-0 right-0"
    bg="[var(--vp-c-bg)]"
    flex="~ col gap-10px"
    p="10px"
  >
    <span>FPS:{{ fps }}</span>
    <span>Interval:{{ interval }}ms</span>
  </div>
</template>
