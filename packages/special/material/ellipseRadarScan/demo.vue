<script setup lang="ts">
import { useEntity, useViewer } from '@cesium-vueuse/core';
import { EllipseRadarScanMaterialProperty } from '@cesium-vueuse/special';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';

const position: [number, number] = [110, 25];

const entity = useEntity(new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(...position),
  ellipse: {
    semiMinorAxis: 100,
    semiMajorAxis: 100,
    material: new EllipseRadarScanMaterialProperty({}),
    outline: true,
    outlineColor: Cesium.Color.RED,
    outlineWidth: 2,
  },
}));

const viewer = useViewer();
watchEffect(() => {
  entity.value && viewer.value?.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(...position, 1000),
    duration: 1,
  });
});
</script>

<template>
  <div />
</template>
