import { toAwaitedValue } from '@cesium-vueuse/shared';
import { computedAsync } from '@vueuse/core';
import { toValue, watchEffect } from 'vue';

import { useViewer } from '../useViewer';

import type { MaybeRefOrAsyncGetter } from '@cesium-vueuse/shared';
import type { Arrayable } from '@vueuse/core';
import type { CustomDataSource, CzmlDataSource, DataSource, DataSourceCollection, GeoJsonDataSource, GpxDataSource, KmlDataSource } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';

export type CesiumDataSource = DataSource | CustomDataSource | CzmlDataSource | GeoJsonDataSource | GpxDataSource | KmlDataSource;

export interface UseDataSourceOptions {
  /**
   * 传递给移除函数的第二项参数
   *
   * `dataSources.remove(dataSource,destroyOnRemove)`
   */
  destroyOnRemove?: boolean;

  /**
   * 添加到的集合容器
   * @default useViewer().value.dataSources
   */
  collection?: DataSourceCollection;

  /**
   * 是否激活
   * @defalut true
   */
  isActive?: MaybeRefOrGetter<boolean>;

  /**
   * Ref passed to receive the updated of async evaluation
   */
  evaluating?: Ref<boolean>;
}

export function useDataSource<T extends CesiumDataSource = CesiumDataSource>(
  entity?: MaybeRefOrAsyncGetter<T | undefined>,
  options?: UseDataSourceOptions
): ComputedRef<T | undefined>;

export function useDataSource<T extends CesiumDataSource = CesiumDataSource>(
  entities?: MaybeRefOrAsyncGetter<Array<T | undefined>>,
  options?: UseDataSourceOptions
): ComputedRef<(T | undefined)[]>;

export function useDataSource<T extends CesiumDataSource>(
  data?: MaybeRefOrAsyncGetter<Arrayable<T | undefined>>,
  options: UseDataSourceOptions = {},
) {
  const {
    destroyOnRemove,
    collection,
    isActive,
    evaluating,
  } = options;

  const result = computedAsync(
    () => toAwaitedValue(data),
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
      const _collection = collection ?? viewer.value.dataSources;
      list.forEach(item => (item && _collection.add(item)));
      onCleanup(() => {
        const destroy = toValue(destroyOnRemove);
        list.forEach(item => item && _collection.remove(item, destroy));
      });
    }
  });

  return result;
}
