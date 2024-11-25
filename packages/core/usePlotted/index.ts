import type { Cartesian3, Entity, Primitive } from 'cesium';
import type { ShallowRef } from 'vue';
import { createGuid, CustomDataSource, PrimitiveCollection } from 'cesium';
import { useDataSource } from '../useDataSource';
import { useEntityScope } from '../useEntityScope';
import { usePrimitive } from '../usePrimitive';
import { usePrimitiveScope } from '../usePrimitiveScope';

export interface UsePlottedOptions {
  /**
   * 控制点渲染
   */
  controlPointRender: (positions: Cartesian3[], isCompleted: boolean) => Entity;

  /**
   * 辅助点渲染
   */
  auxiliaryPointRender: (positions: Cartesian3[], isCompleted: boolean) => Entity;

  /**
   * 移动点渲染
   */
  movedPointRender: (positions: Cartesian3[], isCompleted: boolean) => Entity;

  /**
   * 海拔点渲染
   */
  altitudePointRender: (positions: Cartesian3[], isCompleted: boolean) => Entity;

  /**
   * 高度点渲染
   */
  lengthRender: (positions: Cartesian3[], isCompleted: boolean) => Entity;
}

export interface PlottedScheme {
  /**
   * 标绘类型，全局唯一标识
   */
  type: string;

  /**
   * 是否立即执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回`true`则标绘完成
   */
  complete: (positions: Cartesian3[]) => boolean;

  /**
   * 双击时，是否执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回 true 则下一次双击事件执行完成
   */
  completeOnDoubleClick: (positions: Cartesian3[]) => boolean;

  /**
   * 是否渲染控制点
   */
  control: (isCompleted: boolean) => boolean;

  /**
   * 计算辅助点位置
   */
  controlPositions: (positions: Cartesian3[]) => Cartesian3[];

  /**
   * 是否渲染辅助点
   */
  auxiliary: (isCompleted: boolean) => boolean;

  /**
   * 计算辅助点位置
   */
  auxiliaryPositions: (positions: Cartesian3[]) => Cartesian3[];

  /**
   */
  render: () => PlottedResult;
}

export interface PlottedResult {
  /**
   * 标绘类型，全局唯一标识
   */
  type: string;
  items: {
    type: 'Entity' | 'Primitive';
    value: Entity | Primitive | any;
  };
}

export type UsePlottedTrigger = (scheme: PlottedScheme) => Promise<PlottedResult>;

export interface UsePlottedRetrun {

  /**
   * 触发标绘
   */
  trigger: UsePlottedTrigger;
  /**
   * 强制终止当前进行中的标绘
   */
  cancel: VoidFunction;

  current?: ShallowRef<PlottedResult | undefined>;

  data?: ShallowRef<PlottedResult[]>;
}

export function usePlotted(options?: UsePlottedOptions): UsePlottedRetrun {
  const scaffoldEntityScope = useEntityScope({
    collection: useDataSource(new CustomDataSource(`plotted-scaffold-${createGuid()}`)).value!.entities,
  });

  const entityScope = useEntityScope({
    collection: useDataSource(new CustomDataSource(`plotted-${createGuid()}`)).value!.entities,
  });

  const primitiveScope = usePrimitiveScope({
    collection: usePrimitive(new PrimitiveCollection()).value!,
  });
}
