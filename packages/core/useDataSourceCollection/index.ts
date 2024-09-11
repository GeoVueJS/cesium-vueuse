import { toValue } from '@vueuse/core';
import { computed } from 'vue';

import type { MaybeRefOrGetter } from '@vueuse/core';
import type { DataSourceCollection } from 'cesium';

import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

/**
 * UseDataSourceCollection构造参数
 */
export interface UseDataSourceCollectionOptions {
  /**
   * 执行 `removeScope`时附加的参数
   */
  destroyOnRemoveScope?: boolean;
}

/**
 * UseDataSourceCollection返回参数
 */
export function useDataSourceCollection(
  collection?: MaybeRefOrGetter<DataSourceCollection | undefined>,
  options: UseDataSourceCollectionOptions = {},
) {
  const viewer = useViewer();
  const raw = computed(() => {
    return toValue(collection) || viewer.value?.dataSources;
  });
  const add: DataSourceCollection['add'] = (...args) => raw.value.add(...args);
  const remove: DataSourceCollection['remove'] = (...args) => raw.value.remove(...args);
  const effects = useCollectionScope(add, remove, [options.destroyOnRemoveScope]);

  return {
    raw,
    ...effects,
  };
}
