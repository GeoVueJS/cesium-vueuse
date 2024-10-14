<script setup lang="ts">
import { useEntity, useGraphicEventHandler, useViewer } from '@cesium-vueuse/core';
import { canvasCoordToCartesian, toProperty } from '@cesium-vueuse/shared';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';

const viewer = useViewer();

watchEffect(() => {
  viewer.value?.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(150, 12.5, 9000000),
  });
});

// =========[CLICK]============
const entity1 = useEntity(new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(140, 10),
  point: { pixelSize: 15 },
  label: {
    font: '14px sans-serif',
    pixelOffset: new Cesium.Cartesian2(0, 20),
    text: 'CLICK ME',
  },
}));

useGraphicEventHandler({
  type: 'LEFT_CLICK',
  graphic: entity1,
  listener: (_params) => {
    const color = new Cesium.ConstantProperty(Cesium.Color.RED);
    entity1.value!.point!.color = color;
    entity1.value!.label!.fillColor = color;
    entity1.value!.label!.text = new Cesium.ConstantProperty('CLICKED');
  },
});

// =========[HOVER]============
const entity2 = useEntity(new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(150, 10),
  point: { pixelSize: 15 },
  label: {
    font: '14px sans-serif',
    pixelOffset: new Cesium.Cartesian2(0, 20),
    text: 'HOVER ME',
  },
}));

useGraphicEventHandler({
  type: 'HOVER',
  graphic: entity2,
  listener: (params) => {
    const color = params.hover ? Cesium.Color.RED : undefined;
    entity2.value!.point!.color = toProperty(color);
    entity2.value!.label!.fillColor = toProperty(color);
    entity2.value!.label!.text = toProperty(params.hover ? 'HOVERING' : 'HOVER ME');
  },
});

// =========[DRAG]============
const entity3 = useEntity(new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(160, 10),
  point: { pixelSize: 15 },
  label: {
    font: '14px sans-serif',
    pixelOffset: new Cesium.Cartesian2(0, 20),
    text: 'DRAG ME',
  },
}));

useGraphicEventHandler({
  type: 'DRAG',
  graphic: entity3,
  listener: (params) => {
    const color = params.drag ? Cesium.Color.RED : undefined;
    entity3.value!.point!.color = toProperty(color);
    entity3.value!.label!.fillColor = toProperty(color);
    entity3.value!.label!.text = toProperty(params.drag ? 'DRAGGING' : 'DRAG ME');

    // lock camera
    viewer.value!.scene.screenSpaceCameraController.enableRotate = !params.drag;

    // update position
    const position = canvasCoordToCartesian(params.context.endPosition, viewer.value!.scene);
    if (position) {
      entity3.value!.position = new Cesium.CallbackPositionProperty(() => position, false);
    }
  },
});
</script>

<template>
  <div />
</template>
