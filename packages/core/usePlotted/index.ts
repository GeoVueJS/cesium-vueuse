import type { Cartesian3, Entity, Primitive } from 'cesium';
import type { ShallowRef } from 'vue';
import type { PlottedScheme } from './plotted-scheme';
import { createGuid, CustomDataSource, PrimitiveCollection, ScreenSpaceEventType } from 'cesium';
import { shallowReactive, shallowRef } from 'vue';
import { useDataSource } from '../useDataSource';
import { useEntityScope } from '../useEntityScope';
import { usePrimitive } from '../usePrimitive';
import { usePrimitiveScope } from '../usePrimitiveScope';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';
import { useViewer } from '../useViewer';

export interface UsePlottedOptions {

}

export interface PlottedResult {
  /**
   * 标绘类型，全局唯一标识
   */
  udid: string;
  type: string;
  positions?: Cartesian3[];
  items: {
    type: 'Entity' | 'Primitive';
    value: Entity | Primitive | any;
  }[];
}

export type UsePlottedExecute = (scheme: PlottedScheme, positions: Cartesian3[]) => Promise<PlottedResult>;

export interface UsePlottedRetrun {
  data?: ShallowRef<PlottedResult[]>;

  current?: ShallowRef<PlottedResult | undefined>;
  /**
   * 触发标绘
   */
  execute: UsePlottedExecute;

  /**
   * 强制终止当前进行中的标绘
   */
  cancel: VoidFunction;
}

export function usePlotted(options?: UsePlottedOptions): UsePlottedRetrun {
  const viewer = useViewer();

  const scaffoldScope = useEntityScope({ collection: useDataSource(new CustomDataSource(`plotted-scaffold-${createGuid()}`)).value!.entities });
  const entityScope = useEntityScope({ collection: useDataSource(new CustomDataSource(`plotted-${createGuid()}`)).value!.entities });
  const primitiveScope = usePrimitiveScope({ collection: usePrimitive(new PrimitiveCollection()).value! });

  const data = shallowReactive<PlottedResult[]>([]);
  const current = shallowRef<UsePlottedRetrun>();

  useScreenSpaceEventHandler({
    type: ScreenSpaceEventType.LEFT_CLICK,
    inputAction: (ctx) => {

    },
  });

  useScreenSpaceEventHandler({
    type: ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    inputAction: (ctx) => {

    },
  });

  const execute: UsePlottedExecute = async (scheme, positions) => {
    const result: PlottedResult = {
      udid: createGuid(),
      type: scheme.type,
      items: [],
    };
    return result;
  };

  const cancel = () => {
  };

  return {
    execute,
    cancel,
  };
}
