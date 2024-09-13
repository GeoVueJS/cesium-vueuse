import { toValue } from '@vueuse/core';
import { computed } from 'vue';

import type { MaybeRefOrGetter } from '@vueuse/core';
import type { ImageryLayerCollection } from 'cesium';

import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

export interface UseImageryLayerCollectionScopeOptions {

  /**
   * The collection of DataSource to be added
   * @default useViewer().value.entities
   */
  collection?: MaybeRefOrGetter<ImageryLayerCollection | undefined>;

  /**
   * 执行 `removeScope`时附加的参数
   */
  destroyOnRemoveScope?: boolean;
}

export function useImageryLayerCollectionScope(
  options: UseImageryLayerCollectionScopeOptions = {},
) {
  const { collection: _collection, destroyOnRemoveScope } = options;

  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) || viewer.value?.imageryLayers;
  });

  const add = (...args: Parameters<ImageryLayerCollection['add']>) => {
    collection.value!.add(...args);
    return args[0];
  };
  const remove: ImageryLayerCollection['remove'] = (...args) => {
    return collection.value!.remove(...args);
  };

  const effects = useCollectionScope(add, remove, [destroyOnRemoveScope]);

  return {
    collection,
    ...effects,
  };
}
