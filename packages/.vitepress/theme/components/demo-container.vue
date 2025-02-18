<script lang="ts" setup>
import type { AsyncComponentLoader } from 'vue';
import { refAutoReset, useClipboard, useFullscreen } from '@vueuse/core';

import { defineAsyncComponent, ref, shallowRef } from 'vue';

const props = withDefaults(defineProps<{
  /**
   * Relative path to demo file
   */
  src: string;

  /**
   * use cesium container
   * @default true
   */
  cesium?: boolean;

  /**
   * Relative root path to demo file
   * - note: it's automatically generated
   */
  path: string;

  /**
   * demo's asynchronous component loading function
   * - note: it's automatically generated
   */
  aysncDemo: AsyncComponentLoader;
  /**
   * content to demo file
   * - note: it's automatically generated
   */
  code: string;
  /**
   * highlighted code html
   * - note: it's automatically generated
   */
  codeHtml: string;
}>(), {
  cesium: true,
});

const containerRef = shallowRef<HTMLDivElement>();
const { toggle } = useFullscreen(containerRef);

const reset = refAutoReset(true, 1);

const { copy, copied } = useClipboard({
  source: () => decodeURIComponent(props.code),
});
const sourceVisible = ref(false);

const demo = defineAsyncComponent(props.aysncDemo);

function openGithub() {
  window.open(`https://github.com/GeoVueJS/vesium/blob/main/${props.path}`);
}
</script>

<template>
  <div
    class="demo-container"
    b="1px [var(--vp-c-divider)]"
    rd="4px"
    of="hidden"
  >
    <client-only>
      <div ref="containerRef" class="demo-view relative min-h-550px text-12px">
        <Suspense v-if="reset">
          <component :is="defineAsyncComponent(() => import('./cesium-container.vue'))" v-if="cesium">
            <component :is="demo" />
          </component>
          <component :is="demo" v-else />
          <template #fallback>
            <div class="absolute inset-0" flex="~ justify-center items-center">
              <span class="i-svg-spinners:3-dots-scale block" text="50px [var(--vp-c-brand-1)]" />
            </div>
          </template>
        </Suspense>
      </div>
    </client-only>
    <div
      class="handle-bar"
      size="h-40px"
      p="x-10px"
      flex="~ justify-end items-center"
      b-t="1px [var(--vp-c-divider)]"
      children:p="8px"
      children:mx="8px"
    >
      <button
        class="i-tabler:arrows-maximize"
        @click="toggle"
      />
      <button
        class="i-tabler:reload"
        @click="reset = false"
      />
      <button
        class="i-tabler:brand-github"
        @click="openGithub"
      />
      <button
        :class="{ 'i-tabler:copy': !copied, 'i-tabler:check': copied }"
        @click="copy()"
      />
      <button
        class="i-tabler:code"
        @click="sourceVisible = !sourceVisible"
      />
    </div>

    <div
      class="preview-code-area"
      :class="{
        'preview-code-area--active': sourceVisible,
      }"
      v-html="decodeURIComponent(props.codeHtml)"
    />
  </div>
</template>

<style lang="scss">
  .preview-code-area {
  z-index: 1;
  position: relative;
  transition: height 3s ease;
  overflow: hidden;
  height: 0;

  &.preview-code-area--active {
    border-top: 1px solid var(--vp-c-divider);
    height: auto;
  }

  :deep(div[class*='language-']) {
    margin: 0px;
    border-radius: 0;
  }
}
.demo-view {
  button {
    padding: 3px 15px;
    background-color: var(--vp-c-brand);
    border: none;
    outline: none;
    color: #fff;
    margin-right: 0.5em;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    vertical-align: middle;
    &:hover {
      background-color: var(--vp-c-brand-2);
    }
    &:nth-last-child {
      margin-right: 0.5em;
    }
  }
}
</style>
