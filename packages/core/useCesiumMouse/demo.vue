<script setup lang="ts">
import { useCesiumMouse } from '@cesium-vueuse/core';
import { toCoord } from '@cesium-vueuse/shared';

const { position, coordinate } = useCesiumMouse();
</script>

<template>
  <div
    position="absolute left-0 bottom-0 right-0"
    bg="[var(--vp-c-bg)]"
    flex="~ col gap-10px"
    p="10px"
  >
    <span>position:{{ position }}</span>
    <span>lnglat:{{ toCoord(position) }}</span>
    <span>coordinate:{{ coordinate }}</span>
  </div>
</template>
