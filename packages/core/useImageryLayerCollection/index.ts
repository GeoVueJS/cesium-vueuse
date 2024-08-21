import { toValue } from '@vueuse/core';
import { computed } from 'vue';

import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

import type { MaybeRefOrGetter } from '@vueuse/core';
import type { ImageryLayerCollection } from 'cesium';

/**
 * UseImageryLayerCollection构造参数
 */
export interface UseImageryLayerCollectionOptions {
  /**
   * 执行 `removeScope`时附加的参数
   */
  destroyOnRemoveScope?: boolean;
}

/**
 * UseImageryLayerCollection返回参数
 */
export function useImageryLayerCollection(
  collection?: MaybeRefOrGetter<ImageryLayerCollection | undefined>,
  options: UseImageryLayerCollectionOptions = {},
) {
  const viewer = useViewer();

  const raw = computed(() => {
    return toValue(collection) || viewer.value.imageryLayers;
  });

  const add = (...args: Parameters<ImageryLayerCollection['add']>) => {
    raw.value.add(...args);
    return args[0];
  };
  const remove: ImageryLayerCollection['remove'] = (...args) => raw.value.remove(...args);
  const effects = useCollectionScope(add, remove, [options.destroyOnRemoveScope]);

  return {
    raw,
    ...effects,
  };
}
