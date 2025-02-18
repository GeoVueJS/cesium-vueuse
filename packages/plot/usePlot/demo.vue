<script setup lang="ts">
import { PLOT_LABEL_SCHEME, PLOT_LINE_STRING_SCHEME, PLOT_POLYGON_SCHEME, usePlot } from '@vesium/plot';

const { operate } = usePlot();

const otpions = [
  {
    label: 'Lebel',
    scheme: PLOT_LABEL_SCHEME,
  },
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
