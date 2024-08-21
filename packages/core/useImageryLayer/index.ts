import { toAwaitedValue } from '@cesium-vueuse/shared';
import { computedAsync } from '@vueuse/core';
import { ImageryLayer } from 'cesium';
import { computed, toValue, watchEffect } from 'vue';

import { useViewer } from '../useViewer';

import type { MaybeRefOrAsyncGetter } from '@cesium-vueuse/shared';
import type { Arrayable } from '@vueuse/core';
import type { ImageryLayerCollection, ImageryProvider } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';

function toImageryLayer(layerOrProvider?: ImageryLayer | ImageryProvider): ImageryLayer | undefined {
  return layerOrProvider ? layerOrProvider instanceof ImageryLayer ? layerOrProvider : new ImageryLayer(layerOrProvider) : undefined;
}

export interface UseImageryLayerOptions {
  /**
   * 传递给移除函数的第二项参数
   *
   * `imageryLayers.remove(layer,destroyOnRemove)`
   */
  destroyOnRemove?: MaybeRefOrGetter<boolean>;

  /**
   * 添加到的集合容器
   * @default useViewer().value.imageryLayers
   */
  collection?: ImageryLayerCollection;

  /**
   * 是否激活
   * @defalut true
   */
  isActive?: MaybeRefOrGetter<boolean>;

  /**
   * Ref passed to receive the updated of async evaluation
   */
  evaluating?: Ref<boolean>;
}

export function useImageryLayer<T extends ImageryLayer = ImageryLayer>(
  layer?: MaybeRefOrAsyncGetter<ImageryLayer.ConstructorOptions | T | undefined>,
  options?: UseImageryLayerOptions
): ComputedRef<T | undefined>;

export function useImageryLayer<T extends ImageryLayer = ImageryLayer>(
  layers?: MaybeRefOrAsyncGetter<Array<ImageryLayer.ConstructorOptions | T | undefined>>,
  options?: UseImageryLayerOptions
): ComputedRef<(T | undefined)[]>;

export function useImageryLayer<T extends ImageryLayer>(
  data?: MaybeRefOrAsyncGetter<Arrayable<T | undefined>>,
  options: UseImageryLayerOptions = {},
) {
  const {
    destroyOnRemove,
    collection,
    isActive = true,
    evaluating,
  } = options;

  const maybeList = computedAsync(
    () => toAwaitedValue(data),
    [],
    {
      evaluating,
    },
  );

  const result = computed(() => {
    if (Array.isArray(maybeList.value)) {
      return maybeList.value.map(data => toImageryLayer(data));
    }
    else {
      const data = maybeList.value;
      return toImageryLayer(data);
    }
  });

  const viewer = useViewer();

  watchEffect((onCleanup) => {
    const _isActive = toValue(isActive);
    if (_isActive) {
      const list = Array.isArray(result.value) ? [...result.value] : [result.value];
      const _collection = collection ?? viewer.value?.imageryLayers;
      list.forEach(item => (item && _collection?.add(item)));
      onCleanup(() => {
        const destroy = toValue(destroyOnRemove);
        list.forEach(item => item && _collection?.remove(item, destroy));
      });
    }
  });

  return result;
}
