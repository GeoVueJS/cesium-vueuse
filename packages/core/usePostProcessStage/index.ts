import type { MaybeRefOrAsyncGetter } from '@cesium-vueuse/shared';
import type { Arrayable } from '@vueuse/core';
import type { PostProcessStage, PostProcessStageCollection } from 'cesium';

import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';

import { toAwaitedValue } from '@cesium-vueuse/shared';
import { computedAsync } from '@vueuse/core';
import { toValue, watchEffect } from 'vue';
import { useViewer } from '../useViewer';

export interface UsePostProcessStageOptions {
  /**
   * The collection of PostProcessStage to be added
   * @default useViewer().scene.postProcessStages
   */
  collection?: PostProcessStageCollection;

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
 * Add `PostProcessStage` to the `PostProcessStageCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `PostProcessStage`.
 *
 * overLoaded1: Parameter supports passing in a single value.
 */
export function usePostProcessStage<T extends PostProcessStage = PostProcessStage>(
  stage?: MaybeRefOrAsyncGetter<T | undefined>,
  options?: UsePostProcessStageOptions
): ComputedRef<T | undefined>;

/**
 * Add `PostProcessStage` to the `PostProcessStageCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `PostProcessStage`.
 *
 * overLoaded2: Parameter supports passing in an array.
 */
export function usePostProcessStage<T extends PostProcessStage = PostProcessStage>(
  stages?: MaybeRefOrAsyncGetter<Array<T | undefined>>,
  options?: UsePostProcessStageOptions
): ComputedRef<T[] | undefined>;

export function usePostProcessStage<T extends PostProcessStage>(
  data?: MaybeRefOrAsyncGetter<Arrayable<T | undefined>>,
  options: UsePostProcessStageOptions = {},
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
    if (!viewer.value) {
      return;
    }
    const _isActive = toValue(isActive);
    if (_isActive) {
      const list = Array.isArray(result.value) ? [...result.value] : [result.value];
      const _collection = collection ?? viewer.value.scene.postProcessStages;

      list.forEach(item => (item && _collection.add(item)));
      onCleanup(() => {
        list.forEach(item => item && _collection.remove(item));
      });
    }
  });

  return result;
}
