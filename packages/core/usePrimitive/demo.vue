<script setup lang="ts">
import { usePrimitive } from '@vesium/core';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';

const billboardCollection = usePrimitive(() => {
  const rotationMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(0)));
  const modelMatrix = Cesium.Matrix4.multiply(Cesium.Matrix4.IDENTITY, rotationMatrix, new Cesium.Matrix4());
  return new Cesium.BillboardCollection({ modelMatrix });
});

watchEffect((onCleanup) => {
  const label = billboardCollection.value?.add(
    new Cesium.Billboard({
      position: Cesium.Cartesian3.fromDegrees(-80, 20),
      image: '/favicon.svg',
      width: 50,
      height: 50,
    }, billboardCollection.value),
  );
  onCleanup(() => {
    try {
      label && !billboardCollection.value?.isDestroyed() && billboardCollection.value?.remove(label);
    }
    catch (error) {
      console.error(error);
    }
  });
});
</script>

<template>
</template>
