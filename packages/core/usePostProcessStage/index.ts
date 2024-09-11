import { toAwaitedValue } from '@cesium-vueuse/shared';
import { computedAsync } from '@vueuse/core';
import { toValue, watchEffect } from 'vue';

import type { MaybeRefOrAsyncGetter } from '@cesium-vueuse/shared';

import type { Arrayable } from '@vueuse/core';
import type { PostProcessStage, PostProcessStageCollection } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { useViewer } from '../useViewer';

export interface UsePostProcessStageOptions {
  /**
   * 添加到的集合容器
   * @default useViewer().scene.postProcessStages
   */
  collection?: PostProcessStageCollection;

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

export function usePostProcessStage<T extends PostProcessStage = PostProcessStage>(
  stage?: MaybeRefOrAsyncGetter<T | undefined>,
  options?: UsePostProcessStageOptions
): ComputedRef<T | undefined>;

export function usePostProcessStage<T extends PostProcessStage = PostProcessStage>(
  stages?: MaybeRefOrAsyncGetter<Array<T | undefined>>,
  options?: UsePostProcessStageOptions
): ComputedRef<(T | undefined)[]>;

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
