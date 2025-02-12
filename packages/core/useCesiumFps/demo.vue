<script setup lang="ts">
import { useCesiumFps } from '@cesium-vueuse/core';

const { fps, interval } = useCesiumFps({ delay: 300 });
</script>

<template>
  <div
    flex="~ col gap-10px"
    p="10px"
  >
    <span>FPS:{{ fps }}</span>
    <span>Interval:{{ interval }}ms</span>
  </div>
</template>
