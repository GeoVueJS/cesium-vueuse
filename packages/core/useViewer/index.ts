import { computed, getCurrentInstance, inject } from 'vue';

import { CREATE_VIEWER_COLLECTION, CREATE_VIEWER_INJECTION_KEY } from '../createViewer';

import type { Viewer } from 'cesium';
import type { ShallowRef } from 'vue';

/**
 * 获取父级inject的`Viewer`对象
 */
export function useViewer(): Readonly<ShallowRef<Viewer | undefined>> {
  const injectViewer = inject(CREATE_VIEWER_INJECTION_KEY);
  const instance = getCurrentInstance();

  const viewer = computed(() => {
    if (instance) {
      return CREATE_VIEWER_COLLECTION.get(instance)?.value;
    }
    else {
      return injectViewer?.value;
    }
  });

  if (!instance || CREATE_VIEWER_COLLECTION.get(instance) || injectViewer) {
    console.warn('未检测到viewer实例的相关注入');
  }
  return viewer!;
}
