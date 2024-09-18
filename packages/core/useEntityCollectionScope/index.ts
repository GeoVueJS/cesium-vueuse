import { computed, toValue } from 'vue';
import type { Entity, EntityCollection } from 'cesium';
import type { MaybeRefOrGetter, ShallowReactive } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';
import type { EffcetRemovePredicate } from '../useCollectionScope';

export interface UseEntityCollectionScopeOptions {
  /**
   * The collection of Entity to be added
   * @default useViewer().value.entities
   */
  collection?: MaybeRefOrGetter<EntityCollection>;
}

export interface UseEntityCollectionScopeRetrun {
  /**
   * A `Set` for storing SideEffect instance,
   * which is encapsulated using `ShallowReactive` to provide Vue's reactive functionality
   */
  scope: Readonly<ShallowReactive<Set<Entity>>>;

  /**
   * Add SideEffect instance
   */
  add: <T extends Entity>(entity: T) => T;

  /**
   * Remove specified SideEffect instance
   */
  remove: (entity: Entity, destroy?: boolean) => boolean;

  /**
   * Remove all SideEffect instance that meets the specified criteria
   */
  removeWhere: (predicate: EffcetRemovePredicate<Entity>, destroy?: boolean) => void;

  /**
   * Remove all SideEffect instance within current scope
   */
  removeScope: (destroy?: boolean) => void;
}

/**
 * Make `add` and `remove` operations of `EntityCollection` scoped,
 * automatically remove `Entity` instance when component is unmounted.
 */
export function useEntityCollectionScope(options: UseEntityCollectionScopeOptions = {}): UseEntityCollectionScopeRetrun {
  const { collection: _collection } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.entities;
  });

  const addFn = <T extends Entity>(entity: T): T => {
    if (!collection.value) {
      throw new Error('collection is not defined');
    }
    return collection.value.add(entity) as T;
  };

  const removeFn = (entity: Entity) => {
    return !!collection.value?.remove(entity);
  };

  const { scope, add, remove, removeWhere, removeScope } = useCollectionScope(addFn, removeFn, []);
  return {
    scope,
    add,
    remove,
    removeWhere,
    removeScope,
  };
}
