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
    position="absolute left-0 bottom-0 right-0"
    h="150px"
    bg="[var(--vp-c-bg)]"
    flex="~ col gap-y-10px"
    p="10px"
    text="12px"
    of="scroll"
  >
    <span>position:{{ position }}</span>
    <span>direction:{{ direction }}</span>
    <span>up:{{ up }}</span>
    <span>right:{{ right }}</span>
    <span>positionCartographic:{{ positionCartographic }}</span>
    <span>positionWC:{{ positionWC }}</span>
    <span>directionWC:{{ directionWC }}</span>
    <span>upWC:{{ upWC }}</span>
    <span>rightWC:{{ rightWC }}</span>
    <span>viewRectangle:{{ viewRectangle }}</span>
    <span>heading:{{ heading }}</span>
    <span>pitch:{{ pitch }}</span>
    <span>roll:{{ roll }}</span>
    <span>level:{{ level }}</span>
  </div>
</template>
