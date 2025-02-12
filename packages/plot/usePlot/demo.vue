<script setup lang="ts">
import { PLOT_LINE_STRING_SCHEME, usePlot } from '@cesium-vueuse/plot';
import { PLOT_POLYGON_SCHEME } from '../scheme/Polygon';

const { operate } = usePlot();

const otpions = [
  {
    label: 'LineString',
    scheme: PLOT_LINE_STRING_SCHEME,
  },
  {
    label: 'Polygon',
    scheme: PLOT_POLYGON_SCHEME,
  },
];
</script>

<template>
  <div p="10px">
    <button v-for="item in otpions" :key="item.label" @click="operate(item.scheme)">
      {{ item.label }}
    </button>
  </div>
</template>
