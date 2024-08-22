import { getCurrentInstance, inject, shallowReadonly } from 'vue';

import { CREATE_VIEWER_COLLECTION, CREATE_VIEWER_INJECTION_KEY } from '../createViewer';

import type { Viewer } from 'cesium';
import type { ShallowRef } from 'vue';

/**
 * 获取当前组件或祖先级组件通过`createViewer`注入的Viewer对象
 */
export function useViewer(): Readonly<ShallowRef<Viewer | undefined>> {
  const instance = getCurrentInstance();

  const injectViewer = inject(CREATE_VIEWER_INJECTION_KEY);
  const instanceViewer = instance ? CREATE_VIEWER_COLLECTION.get(instance) : undefined;

  if (!instanceViewer && !injectViewer) {
    console.warn('未检测到viewer实例的相关注入');
  }
  return instanceViewer ? shallowReadonly(instanceViewer)! : injectViewer!;
}
