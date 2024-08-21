import { toValue } from '@vueuse/core';
import { computed } from 'vue';

import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

import type { MaybeRefOrGetter } from '@vueuse/core';
import type { PostProcessStageCollection } from 'cesium';

/**
 * UsePostProcessStageCollection返回参数
 */
export function usePostProcessStageCollection(collection?: MaybeRefOrGetter<PostProcessStageCollection | undefined>) {
  const viewer = useViewer();

  const raw = computed(() => {
    return toValue(collection) || viewer.value.scene.postProcessStages;
  });

  const add: PostProcessStageCollection['add'] = (...args) => raw.value.add(...args);
  const remove: PostProcessStageCollection['remove'] = (...args) => raw.value.remove(...args);

  const effects = useCollectionScope(add, remove, []);

  return {
    raw,
    ...effects,
  };
}
