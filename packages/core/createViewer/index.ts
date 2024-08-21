import { Viewer } from 'cesium';
import { getCurrentInstance, provide, shallowReadonly, shallowRef, toRaw, toValue, watchEffect } from 'vue';

import type { MaybeComputedElementRef } from '@vueuse/core';
import type { ComponentInternalInstance, InjectionKey, MaybeRefOrGetter, ShallowRef } from 'vue';

/**
 * @internal
 */
export const CREATE_VIEWER_INJECTION_KEY: InjectionKey<Readonly<ShallowRef<Viewer | undefined>>> = Symbol('CREATE_VIEWER_INJECTION_KEY');

/**
 * @internal
 */
export const CREATE_VIEWER_COLLECTION = new WeakMap<ComponentInternalInstance, Readonly<ShallowRef<Viewer | undefined>>>();

/**
 * 提供一个viewer,在后代组件中通过 {@link useViewer} 进行获取
 * @param viewer - 目标Viewer
 */
export function createViewer(
  viewer: MaybeRefOrGetter<Viewer>,
): Readonly<ShallowRef<Viewer | undefined>>;

/**
 * 初始化一个viewer,在后代组件中通过 {@link useViewer} 进行获取
 * @param element - 同 {@link Viewer}初始化函数
 * @param options - 同 {@link Viewer.ConstructorOptions}
 */
export function createViewer(
  element?: MaybeComputedElementRef,
  options?: Viewer.ConstructorOptions,
): Readonly<ShallowRef<Viewer | undefined>>;

export function createViewer(...args: any) {
  const viewer = shallowRef<Viewer>();
  const readonlyViewer = shallowReadonly(viewer);

  provide(CREATE_VIEWER_INJECTION_KEY, readonlyViewer);

  const instance = getCurrentInstance();
  if (instance) {
    CREATE_VIEWER_COLLECTION.set(instance, readonlyViewer);
  }

  watchEffect((onCleanup) => {
    const [arg1, arg2] = args;
    const value = toRaw(toValue(arg1));
    if (value instanceof Viewer) {
      viewer.value = value;
    }
    else if (value) {
      const element = value;
      const options = arg2;
      viewer.value = new Viewer(element, options);
      onCleanup(() => !viewer.value?.isDestroyed() && viewer.value?.destroy());
    }
    else {
      viewer.value = undefined;
    }
  });

  return readonlyViewer;
}
