import { toValue } from '@vueuse/core';
import { computed } from 'vue';

import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

import type { MaybeRefOrGetter } from '@vueuse/core';
import type { PrimitiveCollection } from 'cesium';

/**
 * UsePrimitiveCollection返回参数
 */
export function usePrimitiveCollection(collection?: MaybeRefOrGetter<PrimitiveCollection | undefined>) {
  const viewer = useViewer();
  const raw = computed(() => {
    return toValue(collection) || viewer.value?.scene.primitives;
  });
  const add: PrimitiveCollection['add'] = (...args) => raw.value.add(...args);
  const remove: PrimitiveCollection['remove'] = (...args) => raw.value.remove(...args);
  const effects = useCollectionScope(add, remove, []);

  return {
    raw,
    ...effects,
  };
}
