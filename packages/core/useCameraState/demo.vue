<script setup lang="ts">
import { useCameraState } from '@cesium-vueuse/core';

const {
  position,
  direction,
  up,
  right,
  positionCartographic,
  positionWC,
  directionWC,
  upWC,
  rightWC,
  viewRectangle,
  heading,
  pitch,
  roll,
  level,
} = useCameraState();
</script>

<template>
  <div
    h="250px"
    flex="~ col gap-y-10px"
    p="10px"
    of="scroll"
  >
    <pre> {{ { position, direction, up, right, positionCartographic, positionWC, directionWC, upWC, rightWC, viewRectangle, heading, pitch, roll, level } }}</pre>
  </div>
</template>
