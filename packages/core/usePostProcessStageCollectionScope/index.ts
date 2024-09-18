import { computed, toValue } from 'vue';
import type { PostProcessStage, PostProcessStageCollection } from 'cesium';
import type { MaybeRefOrGetter, ShallowReactive } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';
import type { EffcetRemovePredicate } from '../useCollectionScope';

export interface UsePostProcessStageCollectionScopeOptions {
  /**
   * The collection of PostProcessStage to be added
   * @default useViewer().value.postProcessStages
   */
  collection?: MaybeRefOrGetter<PostProcessStageCollection>;
}

export interface UsePostProcessStageCollectionScopeRetrun {
  /**
   * A `Set` for storing SideEffect instance,
   * which is encapsulated using `ShallowReactive` to provide Vue's reactive functionality
   */
  scope: Readonly<ShallowReactive<Set<PostProcessStage>>>;

  /**
   * Add SideEffect instance
   */
  add: <T extends PostProcessStage>(postProcessStage: T) => T;

  /**
   * Remove specified SideEffect instance
   */
  remove: (postProcessStage: PostProcessStage, destroy?: boolean) => boolean;

  /**
   * Remove all SideEffect instance that meets the specified criteria
   */
  removeWhere: (predicate: EffcetRemovePredicate<PostProcessStage>, destroy?: boolean) => void;

  /**
   * Remove all SideEffect instance within current scope
   */
  removeScope: (destroy?: boolean) => void;
}

/**
 * Make `add` and `remove` operations of `PostProcessStageCollection` scoped,
 * automatically remove `PostProcessStage` instance when component is unmounted.
 */
export function usePostProcessStageCollectionScope(options: UsePostProcessStageCollectionScopeOptions = {}): UsePostProcessStageCollectionScopeRetrun {
  const { collection: _collection } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.postProcessStages;
  });

  const addFn = <T extends PostProcessStage>(postProcessStage: T): T => {
    if (!collection.value) {
      throw new Error('collection is not defined');
    }
    return collection.value.add(postProcessStage) as T;
  };

  const removeFn = (postProcessStage: PostProcessStage) => {
    return !!collection.value?.remove(postProcessStage);
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
