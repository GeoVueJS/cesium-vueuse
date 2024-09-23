import { toAwaitedValue } from '@cesium-vueuse/shared';
import { computedAsync } from '@vueuse/core';
import { toValue, watchEffect } from 'vue';

import type { MaybeRefOrAsyncGetter } from '@cesium-vueuse/shared';

import type { Arrayable } from '@vueuse/core';
import type { Entity, EntityCollection } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { useViewer } from '../useViewer';

export interface UseEntityOptions {
  /**
   * The collection of Entity to be added
   * @default useViewer().value.entities
   */
  collection?: EntityCollection;

  /**
   * default value of `isActive`
   * @defalut true
   */
  isActive?: MaybeRefOrGetter<boolean>;

  /**
   * Ref passed to receive the updated of async evaluation
   */
  evaluating?: Ref<boolean>;
}

/**
 * Add `Entity` to the `EntityCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `Entity`.
 *
 * overLoaded1: Parameter supports passing in a single value.
 */
export function useEntity<T extends Entity = Entity>(
  entity?: MaybeRefOrAsyncGetter<T | undefined>,
  options?: UseEntityOptions
): ComputedRef<T | undefined>;

/**
 * Add `Entity` to the `EntityCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `Entity`.
 *
 * overLoaded2: Parameter supports passing in an array.
 */
export function useEntity<T extends Entity = Entity>(
  entities?: MaybeRefOrAsyncGetter<Array<T | undefined>>,
  options?: UseEntityOptions
): ComputedRef<T[] | undefined>;

export function useEntity<T extends Entity>(
  data?: MaybeRefOrAsyncGetter<Arrayable<T | undefined>>,
  options: UseEntityOptions = {},
) {
  const {
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
      const _collection = collection ?? viewer.value?.entities;
      list.forEach(item => (item && _collection?.add(item)));
      onCleanup(() => {
        list.forEach(item => item && _collection?.remove(item));
      });
    }
  });

  return result;
}
