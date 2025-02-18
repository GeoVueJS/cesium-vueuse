<script setup lang="ts">
import { useImageryLayer, useViewer } from '@vesium/core';
import * as Cesium from 'cesium';
import { ref, watchPostEffect } from 'vue';

const isActive = ref(true);

const imageryLayer = useImageryLayer(
  new Cesium.ImageryLayer(new Cesium.GridImageryProvider({})),
  {
    isActive,
    destroyOnRemove: false,
  },
);

const viewer = useViewer();
watchPostEffect(() => {
  if (imageryLayer.value) {
    viewer.value?.flyTo(
      imageryLayer.value,
      {
        duration: 1,
      },
    );
  }
});
</script>

<template>
  <div
    p="10px"
  >
    <button @click="isActive = !isActive">
      visible:{{ isActive }}
    </button>
  </div>
</template>
