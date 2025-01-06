<script setup lang="ts">
import { usePrimitive } from '@cesium-vueuse/core';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';

const labelCollection = usePrimitive(() => {
  const rotationMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(0)));
  // 设置模型的变换矩阵
  const modelMatrix = Cesium.Matrix4.multiply(Cesium.Matrix4.IDENTITY, rotationMatrix, new Cesium.Matrix4());

  return new Cesium.BillboardCollection({ modelMatrix });
});

watchEffect((onCleanup) => {
  const label = labelCollection.value?.add(new Cesium.Billboard({
    position: Cesium.Cartesian3.fromDegrees(-80, 20),
    image: 'https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/MostlySunnyDay.svg',
  }, labelCollection.value));
  onCleanup(() => {
    try {
      label && !labelCollection.value?.isDestroyed() && labelCollection.value?.remove(label);
    }
    catch (error) {
      console.error(error);
    }
  });
});
</script>

<template>
</template>
