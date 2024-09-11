import { toAwaitedValue } from '@cesium-vueuse/shared';
import { computedAsync } from '@vueuse/core';
import { toValue, watchEffect } from 'vue';

import type { MaybeRefOrAsyncGetter } from '@cesium-vueuse/shared';

import type { Arrayable } from '@vueuse/core';
import type { Cesium3DTileset, Primitive, PrimitiveCollection } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { useViewer } from '../useViewer';

export type CesiumPrimitive = Primitive | Cesium3DTileset;

export interface UsePrimitiveOptions {
  /**
   * 添加到的集合容器
   *
   * ground 则为 useViewer().scene.groundPrimitives
   * @default useViewer().scene.primitives
   */
  collection?: PrimitiveCollection | 'ground';

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

export function usePrimitive<T extends CesiumPrimitive = CesiumPrimitive>(
  primitive?: MaybeRefOrAsyncGetter<T | undefined>,
  options?: UsePrimitiveOptions
): ComputedRef<T | undefined>;

export function usePrimitive<T extends CesiumPrimitive = CesiumPrimitive>(
  primitives?: MaybeRefOrAsyncGetter<Array<T | undefined>>,
  options?: UsePrimitiveOptions
): ComputedRef<(T | undefined)[]>;

export function usePrimitive<T extends Primitive>(
  data?: MaybeRefOrAsyncGetter<Arrayable<T | undefined>>,
  options: UsePrimitiveOptions = {},
) {
  const {
    collection,
    isActive = true,
    evaluating,
  } = options;

  const result = computedAsync(
    () => toAwaitedValue(data),
    undefined,
    {
      evaluating,
    },
  );

  const viewer = useViewer();

  watchEffect((onCleanup) => {
    const _isActive = toValue(isActive);
    if (_isActive) {
      const list = Array.isArray(result.value) ? [...result.value] : [result.value];
      const _collection = collection === 'ground' ? viewer.value?.scene.groundPrimitives : (collection ?? viewer.value?.scene.primitives);

      list.forEach(item => (item && _collection?.add(item)));
      onCleanup(() => {
        list.forEach(item => item && _collection?.remove(item));
      });
    }
  });

  return result;
}
