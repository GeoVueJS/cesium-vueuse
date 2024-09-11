import { toValue } from '@vueuse/core';
import { computed } from 'vue';

import type { MaybeRefOrGetter } from '@vueuse/core';
import type { Entity, EntityCollection } from 'cesium';

import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

/**
 * UseEntityCollection构造参数
 */
export interface UseEntityCollectionOptions {
  collection?: MaybeRefOrGetter<EntityCollection | undefined>;
}

export type UseEntityCollectionReturn = ReturnType<typeof useEntityCollection>;

export function useEntityCollection(collection?: MaybeRefOrGetter<EntityCollection | undefined>) {
  const viewer = useViewer();
  const entityCollection = computed(() => {
    return toValue(collection) ?? viewer.value?.entities;
  });

  function add<T extends Entity>(entity: T): T {
    return entityCollection.value?.add(entity) as any;
  }
  function remove(entity: Entity): boolean {
    return entityCollection.value?.remove(entity);
  }
  const effects = useCollectionScope(add, remove, []);

  return {
    raw: entityCollection,
    ...effects,
  };
}
