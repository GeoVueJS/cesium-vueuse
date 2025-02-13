<script setup lang="ts">
import { useCesiumEventListener, useViewer } from '@cesium-vueuse/core';
import { ref } from 'vue';

const viewer = useViewer();

const changedSymbol = ref('no change');

useCesiumEventListener(() => viewer.value?.camera.moveStart, () => {
  changedSymbol.value = 'moveStart';
});

useCesiumEventListener(() => viewer.value?.camera.moveEnd, () => {
  changedSymbol.value = 'moveEnd';
});
</script>

<template>
  <div
    flex="~ col gap-y-10px"
    p="10px"
  >
    Camera Changed : {{ changedSymbol }}
  </div>
</template>
