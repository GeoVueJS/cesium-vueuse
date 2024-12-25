<script setup lang="ts">
import { useScreenSpaceEventState } from '@cesium-vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { ref } from 'vue';

const eventType = ref(ScreenSpaceEventType.MOUSE_MOVE);
const state = useScreenSpaceEventState(eventType);
</script>

<template>
  <div
    position="absolute top-0 bottom-0 right-0"
    bg="[var(--vp-c-bg)]"
    p="10px"
    w="250px"
    grid="~ cols-1 gap-5px"
    text="12px"
    flex="~ col gap-y-20px"
  >
    <select v-model="eventType" name="ScreenSpaceEventType" b="1px solid #aaa" p="5px">
      <option v-for="(value, name) in ScreenSpaceEventType" :key="value" :value="value">
        {{ name }}
      </option>
    </select>

    <div of="y-scroll" flex="1" b="1px solid #aaa" p="5px">
      <pre>{{ state }}</pre>
    </div>
  </div>
</template>
