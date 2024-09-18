import { toAwaitedValue } from '@cesium-vueuse/shared';
import { computedAsync } from '@vueuse/core';
import { toValue, watchEffect } from 'vue';
import type { MaybeRefOrAsyncGetter } from '@cesium-vueuse/shared';

import type { Arrayable } from '@vueuse/core';

import type { ImageryLayer, ImageryLayerCollection } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { useViewer } from '../useViewer';

export interface UseImageryLayerOptions {

  /**
   * The collection of ImageryLayer to be added
   * @default useViewer().value.imageryLayers
   */
  collection?: ImageryLayerCollection;

  /**
   * default value of `isActive`
   * @defalut true
   */
  isActive?: MaybeRefOrGetter<boolean>;

  /**
   * Ref passed to receive the updated of async evaluation
   */
  evaluating?: Ref<boolean>;

  /**
   * The second parameter passed to the `remove` function
   *
   * `imageryLayers.remove(layer,destroyOnRemove)`
   */
  destroyOnRemove?: MaybeRefOrGetter<boolean>;
}

/**
 * Add `ImageryLayer` to the `ImageryLayerCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `ImageryLayer`.
 *
 * overLoaded1: Parameter supports passing in a single value.
 */
export function useImageryLayer<T extends ImageryLayer = ImageryLayer>(
  layer?: MaybeRefOrAsyncGetter< T | undefined>,
  options?: UseImageryLayerOptions
): ComputedRef<T | undefined>;

/**
 * Add `ImageryLayer` to the `ImageryLayerCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `ImageryLayer`.
 *
 * overLoaded2: Parameter supports passing in an array.
 */
export function useImageryLayer<T extends ImageryLayer = ImageryLayer>(
  layers?: MaybeRefOrAsyncGetter<Array<T | undefined>>,
  options?: UseImageryLayerOptions
): ComputedRef<T[] | undefined>;

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

  const result = computedAsync(
    () => toAwaitedValue(data),
    [],
    {
      evaluating,
    },
  );

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
