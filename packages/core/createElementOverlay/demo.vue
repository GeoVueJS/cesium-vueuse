<script lang="ts" setup>
import { createViewer } from '@cesium-vueuse/core';
import { shallowRef } from 'vue';

const containerRef = shallowRef<HTMLDivElement>();

createViewer(containerRef);
</script>

<template>
  <div ref="containerRef" class="h-300px" />
</template>
