<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    sfcTsCode: string;
    // if using ts, sfcJsCode will transform the to js
    sfcJsCode: string;
    sfcTsHtml: string;
    sfcJsHtml: string;
    title: string;
    cesium?: boolean;
    metadata: object;
  }>(),
  {
    cesium: true,
  },
);

const sfcCode = computed(() => decodeURIComponent(props.sfcTsCode || props.sfcJsCode));

const highlightedHtml = computed(() => decodeURIComponent(props.sfcTsHtml || props.sfcJsHtml));

const { copy } = useClipboard({ source: sfcCode });

async function copyAsync() {
  await copy();
  ElMessage.success('复制成功');
}

const codeVisible = ref(false);
</script>

<template>
  <div
    class="demo-container"
    of="hidden"
    b="1px solid"
    b-color="[--vp-c-divider]"
    rd="4px"
  >
    <slot name="desc" />
    <slot />
    <div>
      <div flex="~ justify-end items-center" h="44px" p="x-10px">
        <el-button :style="{ color: 'var(--vp-c-brand-1)' }" @click="copyAsync()">
          <template #icon>
            <i class="i-tabler:copy" />
          </template>
        </el-button>
        <el-button :style="{ color: 'var(--vp-c-brand-1)' }" @click="codeVisible = !codeVisible">
          <template #icon>
            <i class="i-tabler:code" />
          </template>
        </el-button>
      </div>
      <div
        v-show="codeVisible"
        b-t="1px solid"
        b-color="[--vp-c-divider]"
        p="20px"
      >
        <div
          m="0!"
          rd="0px!"
          v-html="highlightedHtml"
        />
      </div>
    </div>
  </div>
</template>
