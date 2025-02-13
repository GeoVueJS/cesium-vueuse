<script setup lang="ts">
import { useScreenSpaceEventHandler } from '@cesium-vueuse/core';
import * as Cesium from 'cesium';
import { ref } from 'vue';

const coord = ref<Record<any, any>>({});

Object.values(Cesium.ScreenSpaceEventType).forEach((type: any) => {
  useScreenSpaceEventHandler(type, (ctx: any) => coord.value[type] = JSON.stringify(ctx));
});
</script>

<template>
  <div
    p="10px"
    grid="~ cols-2 gap-5px"
  >
    <span v-for="(value, key) in Cesium.ScreenSpaceEventType" :key="key">
      {{ key }}:{{ coord[value] || '--' }}
    </span>
  </div>
</template>
