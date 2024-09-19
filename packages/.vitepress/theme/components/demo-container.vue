<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import { ref } from 'vue';

const props = defineProps<{
  codeHtml: string;
  code: string;
}>();

const { copy, copied } = useClipboard({
  source: () => decodeURIComponent(props.code),
});
const sourceVisible = ref(false);
</script>

<template>
  <slot />
  <div class="demo-container">
    <slot name="demo" />
    <div class="handle-bar">
      <button p="8px" mx="8px" class="i-tabler:brand-github" />
      <button
        p="8px"
        mx="8px"
        :class="{ 'i-tabler:copy': !copied, 'i-tabler:check': copied }"
        @click="copy()"
      />
      <button p="8px" mx="8px" class="i-tabler:code" @click="sourceVisible = !sourceVisible" />
    </div>

    <div
      class="preview-code-area"
      transition="all 300"
      :class="{
        'preview-code-area--active': sourceVisible,
      }"
      v-html="decodeURIComponent(props.codeHtml)"
    />
  </div>
</template>

<style lang="scss" scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  .handle-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
    padding: 0 10px;
  }
  .preview-code-area {
    z-index: 1;
    position: relative;
    transition: all 3s ease;
    overflow: hidden;
    height: 0;
    &.preview-code-area--active {
      border-top: 1px solid var(--vp-c-divider);
      height: auto;
    }
  }
}
</style>
