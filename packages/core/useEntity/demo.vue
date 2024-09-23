<script setup lang="ts">
import { useEntity, useViewer } from '@cesium-vueuse/core';
import * as Cesium from 'cesium';
import { shallowRef, watchPostEffect } from 'vue';

// use entity instance
const entity1 = useEntity(new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(150, 10),
  label: {
    font: '14px Arial',
    text: 'entity instance',
  },
}));

// use getter
const entity2 = useEntity(() => {
  return new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(150, 9),
    label: {
      font: '14px Arial',
      text: 'use getter',
    },
  });
});

const entityRef = shallowRef(new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(150, 8),
  label: {
    font: '14px Arial',
    text: 'use ref',
  },
}));

// use ref
const entity3 = useEntity(entityRef);

// use array
const entities = useEntity([
  new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(149, 7),
    label: {
      font: '14px Arial',
      text: 'array item 1',
    },
  }),
  new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(151, 7),
    label: {
      font: '14px Arial',
      text: 'array item 2',
    },
  }),
]);

const viewer = useViewer();
watchPostEffect(() => {
  if (entity1.value && entity2.value && entity3.value && entities.value) {
    viewer.value?.flyTo([
      entity1.value,
      entity2.value,
      entity3.value,
      ...entities.value!,
    ], {
      duration: 1,
    });
  }
});
</script>

<template>
</template>
