<script setup lang="ts">
import { useDataSource, useViewer } from '@cesium-vueuse/core';
import * as Cesium from 'cesium';
import { watchPostEffect } from 'vue';
import geojson from '../../.vitepress/static/geojson.json?url';

const dataSource = useDataSource(() => Cesium.GeoJsonDataSource.load(geojson));

const viewer = useViewer();
watchPostEffect(() => {
  if (dataSource.value) {
    viewer.value?.flyTo(
      dataSource.value,
      {
        duration: 1,
      },
    );
  }
});
</script>

<template>
</template>
vuesium
