import { computed, toValue } from 'vue';
import type { PrimitiveCollection } from 'cesium';
import type { MaybeRefOrGetter, ShallowReactive } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';
import type { EffcetRemovePredicate } from '../useCollectionScope';
import type { CesiumPrimitive } from '../usePrimitive';

export interface UsePrimitiveScopeOptions {
  /**
   * The collection of Primitive to be added
   * @default useViewer().value.scene.primitives
   */
  collection?: MaybeRefOrGetter<PrimitiveCollection>;
}

export interface UsePrimitiveScopeRetrun {
  /**
   * A `Set` for storing SideEffect instance,
   * which is encapsulated using `ShallowReactive` to provide Vue's reactive functionality
   */
  scope: Readonly<ShallowReactive<Set<CesiumPrimitive>>>;

  /**
   * Add SideEffect instance
   */
  add: <T extends CesiumPrimitive>(primitive: T) => T;

  /**
   * Remove specified SideEffect instance
   */
  remove: (primitive: CesiumPrimitive, destroy?: boolean) => boolean;

  /**
   * Remove all SideEffect instance that meets the specified criteria
   */
  removeWhere: (predicate: EffcetRemovePredicate<CesiumPrimitive>, destroy?: boolean) => void;

  /**
   * Remove all SideEffect instance within current scope
   */
  removeScope: (destroy?: boolean) => void;
}

/**
 * Make `add` and `remove` operations of `PrimitiveCollection` scoped,
 * automatically remove `Primitive` instance when component is unmounted.
 */
export function usePrimitiveScope(options: UsePrimitiveScopeOptions = {}): UsePrimitiveScopeRetrun {
  const { collection: _collection } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.scene.primitives;
  });

  const addFn = <T extends CesiumPrimitive>(primitive: T): T => {
    if (!collection.value) {
      throw new Error('collection is not defined');
    }
    return collection.value.add(primitive) as T;
  };

  const removeFn = (primitive: CesiumPrimitive) => {
    return !!collection.value?.remove(primitive);
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
