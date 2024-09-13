import { computed, toValue } from 'vue';
import type { DataSourceCollection } from 'cesium';
import type { CesiumDataSource } from 'packages/shared';
import type { MaybeRefOrGetter, ShallowReactive } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';
import type { EffcetRemovePredicate } from '../useCollectionScope';

export interface UseDataSourceCollectionScopeOptions {
  /**
   * The collection of DataSource to be added
   * @default useViewer().value.dataSources
   */
  collection?: MaybeRefOrGetter<DataSourceCollection>;

  /**
   * The second parameter passed to the `remove` function
   *
   * `dataSources.remove(dataSource,destroyOnRemove)`
   */
  destroyOnRemove?: boolean;
}

export interface UseDataSourceCollectionScopeRetrun {
  /**
   * A `Set` for storing sideEffect content,
   * which is encapsulated using `ShallowReactive` to provide Vue's reactive functionality
   */
  scope: Readonly<ShallowReactive<Set<CesiumDataSource>>>;

  /**
   * Add sideEffect content
   */
  add: <T extends CesiumDataSource>(dataSource: T) => Promise<T>;

  /**
   * Remove specified sideEffect content
   */
  remove: (dataSource: CesiumDataSource, destroy?: boolean) => boolean;

  /**
   * Remove all sideEffect content that meets the specified criteria
   */
  removeWhere: (predicate: EffcetRemovePredicate<CesiumDataSource>, destroy?: boolean) => void;

  /**
   * Remove all sideEffect content within current scope
   */
  removeScope: (destroy?: boolean) => void;
}

/**
 * Make `add` and `remove` operations of `DataSourceCollection` scoped,
 * automatically remove `DataSource` when component is unmounted.
 */
export function useDataSourceCollectionScope(options: UseDataSourceCollectionScopeOptions = {}): UseDataSourceCollectionScopeRetrun {
  const { collection: _collection, destroyOnRemove } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.dataSources;
  });

  const addFn = <T extends CesiumDataSource>(dataSource: T) => {
    return collection.value!.add(dataSource);
  };

  const removeFn = <T extends CesiumDataSource>(dataSource: T, destroy?: boolean) => {
    return !!collection.value?.remove(dataSource, destroy);
  };

  const { scope, add, remove, removeWhere, removeScope } = useCollectionScope(addFn, removeFn, [destroyOnRemove]);
  return {
    scope,
    add,
    remove,
    removeWhere,
    removeScope,
  };
}