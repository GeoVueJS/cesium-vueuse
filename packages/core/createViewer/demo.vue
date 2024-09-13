<script lang="ts" setup>
import { createViewer } from '@cesium-vueuse/core';
import { shallowRef } from 'vue';
import 'cesium/Build/Cesium/Widgets/widgets.css';

const elRef = shallowRef<HTMLDivElement>();

createViewer(elRef, {
  // ...
});
</script>

<template>
  <div ref="elRef" />
</template>
