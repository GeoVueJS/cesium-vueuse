<script setup lang="ts">
import { usePrimitive, useViewer } from '@cesium-vueuse/core';
import * as Cesium from 'cesium';
import { watchPostEffect } from 'vue';

// use entity instance
const tileset = usePrimitive(() => new Cesium.Cesium3DTileset.fromUrl());

const viewer = useViewer();
watchPostEffect(() => {
  if ( ) {

  }
});
</script>

<template>
</template>
