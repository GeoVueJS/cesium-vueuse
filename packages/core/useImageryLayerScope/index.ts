import type { ImageryLayer, ImageryLayerCollection } from 'cesium';
import type { MaybeRefOrGetter, ShallowReactive } from 'vue';
import type { EffcetRemovePredicate } from '../useCollectionScope';
import { computed, toValue } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

export interface UseImageryLayerScopeOptions {
  /**
   * The collection of ImageryLayer to be added
   * @default useViewer().value.imageryLayers
   */
  collection?: MaybeRefOrGetter<ImageryLayerCollection>;

  /**
   * The second parameter passed to the `remove` function
   *
   * `imageryLayers.remove(imageryLayer,destroyOnRemove)`
   */
  destroyOnRemove?: boolean;
}

export interface UseImageryLayerScopeRetrun {
  /**
   * A `Set` for storing SideEffect instance,
   * which is encapsulated using `ShallowReactive` to provide Vue's reactive functionality
   */
  scope: Readonly<ShallowReactive<Set<ImageryLayer>>>;

  /**
   * Add SideEffect instance
   */
  add: <T extends ImageryLayer>(imageryLayer: T) => T;

  /**
   * Remove specified SideEffect instance
   */
  remove: (imageryLayer: ImageryLayer, destroy?: boolean) => boolean;

  /**
   * Remove all SideEffect instance that meets the specified criteria
   */
  removeWhere: (predicate: EffcetRemovePredicate<ImageryLayer>, destroy?: boolean) => void;

  /**
   * Remove all SideEffect instance within current scope
   */
  removeScope: (destroy?: boolean) => void;
}

/**
 * Make `add` and `remove` operations of `ImageryLayerCollection` scoped,
 * automatically remove `ImageryLayer` instance when component is unmounted.
 */
export function useImageryLayerScope(options: UseImageryLayerScopeOptions = {}): UseImageryLayerScopeRetrun {
  const { collection: _collection, destroyOnRemove } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.imageryLayers;
  });

  const addFn = <T extends ImageryLayer>(imageryLayer: T, index?: number): T => {
    if (!collection.value) {
      throw new Error('collection is not defined');
    }
    collection.value.add(imageryLayer, index);
    return imageryLayer;
  };

  const removeFn = (imageryLayer: ImageryLayer, destroy?: boolean) => {
    return !!collection.value?.remove(imageryLayer, destroy);
  };

  const { scope, add, remove, removeWhere, removeScope } = useCollectionScope<false>(addFn, removeFn, [destroyOnRemove]);
  return {
    scope,
    add,
    remove,
    removeWhere,
    removeScope,
  };
}
