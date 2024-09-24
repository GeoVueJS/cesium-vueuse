<script setup lang="ts">
import { useScreenSpaceEventHandler } from '@cesium-vueuse/core';
import * as Cesium from 'cesium';
import { ref } from 'vue';

const coord = ref<Record<any, any>>({});

Object.values(Cesium.ScreenSpaceEventType).forEach((type: any) => {
  useScreenSpaceEventHandler({
    type,
    inputAction: (ctx: any) => coord.value[type] = JSON.stringify(ctx),
  });
});
</script>

<template>
  <div
    position="absolute left-0 bottom-0 right-0"
    bg="[var(--vp-c-bg)]"
    p="10px"
    h="150px"
    of="y-scroll"
    grid="~ cols-2 gap-5px"
    text="12px"
  >
    <span v-for="(value, key) in Cesium.ScreenSpaceEventType" :key="key">
      {{ key }}:{{ coord[value] || '--' }}
    </span>
  </div>
</template>
