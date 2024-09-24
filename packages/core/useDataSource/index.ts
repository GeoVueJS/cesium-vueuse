import type { MaybeRefOrAsyncGetter } from '@cesium-vueuse/shared';
import type { Arrayable } from '@vueuse/core';
import type { CustomDataSource, CzmlDataSource, DataSource, DataSourceCollection, GeoJsonDataSource, GpxDataSource, KmlDataSource } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { toAwaitedValue } from '@cesium-vueuse/shared';
import { computedAsync } from '@vueuse/core';
import { toValue, watchEffect } from 'vue';
import { useViewer } from '../useViewer';

export type CesiumDataSource = DataSource | CustomDataSource | CzmlDataSource | GeoJsonDataSource | GpxDataSource | KmlDataSource;

export interface UseDataSourceOptions {
  /**
   * The collection of DataSource to be added
   * @default useViewer().value.dataSources
   */
  collection?: DataSourceCollection;

  /**
   * default value of `isActive`
   * @defalut true
   */
  isActive?: MaybeRefOrGetter<boolean>;

  /**
   * Ref passed to receive the updated of async evaluation
   */
  evaluating?: Ref<boolean>;

  /**
   * The second parameter passed to the `remove` function
   *
   * `dataSources.remove(dataSource,destroyOnRemove)`
   */
  destroyOnRemove?: MaybeRefOrGetter<boolean>;

}

/**
 * Add `DataSource` to the `DataSourceCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `DataSource`.
 *
 * overLoaded1: Parameter supports passing in a single value.
 */
export function useDataSource<T extends CesiumDataSource = CesiumDataSource>(
  dataSource?: MaybeRefOrAsyncGetter<T | undefined>,
  options?: UseDataSourceOptions
): ComputedRef<T | undefined>;

/**
 * Add `DataSource` to the `DataSourceCollection`, automatically update when the data changes, and destroy the side effects caused by the previous `DataSource`.
 *
 * overLoaded2: Parameter supports passing in an array.
 */
export function useDataSource<T extends CesiumDataSource = CesiumDataSource>(
  dataSources?: MaybeRefOrAsyncGetter<T[] | undefined>,
  options?: UseDataSourceOptions
): ComputedRef<T[] | undefined>;

export function useDataSource<T extends CesiumDataSource>(
  dataSources?: MaybeRefOrAsyncGetter<Arrayable<T | undefined>>,
  options: UseDataSourceOptions = {},
) {
  const {
    destroyOnRemove,
    collection,
    isActive = true,
    evaluating,
  } = options;

  const result = computedAsync(
    () => toAwaitedValue(dataSources),
    undefined,
    {
      evaluating,
    },
  );

  const viewer = useViewer();

  watchEffect((onCleanup) => {
    const _isActive = toValue(isActive);
    if (_isActive) {
      const list = Array.isArray(result.value) ? [...result.value] : [result.value];
      const _collection = collection ?? viewer.value?.dataSources;
      list.forEach(item => (item && _collection?.add(item)));
      onCleanup(() => {
        const destroy = toValue(destroyOnRemove);
        list.forEach(item => item && _collection?.remove(item, destroy));
      });
    }
  });

  return result;
}
