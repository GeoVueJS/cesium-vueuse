import { getCurrentInstance, inject } from 'vue';

import type { Viewer } from 'cesium';

import type { ShallowRef } from 'vue';
import { CREATE_VIEWER_COLLECTION, CREATE_VIEWER_INJECTION_KEY } from '../createViewer';

/**
 * 获取当前组件或祖先级组件通过`createViewer`注入的Viewer对象
 */
export function useViewer(): Readonly<ShallowRef<Viewer | undefined>> {
  const instance = getCurrentInstance();
  const instanceViewer = instance ? CREATE_VIEWER_COLLECTION.get(instance) : undefined;
  if (instanceViewer) {
    return instanceViewer;
  }
  else {
    const injectViewer = inject(CREATE_VIEWER_INJECTION_KEY);
    if (!injectViewer) {
      throw new Error('当前组件或祖先级组件中未找到通过createViewer注入的Viewer对象');
    }
    return injectViewer;
  }
}
