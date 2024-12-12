import type { Cartesian3, Entity, Primitive } from 'cesium';
import type { ShallowRef } from 'vue';
import type { PlottedScheme } from './plotted-scheme';
import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { createGuid, CustomDataSource, PrimitiveCollection, ScreenSpaceEventType } from 'cesium';
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
  items: {
    type: 'Entity' | 'Primitive';
    value: Entity | Primitive | any;
  };
}

export type UsePlottedTrigger = (scheme: PlottedScheme, initPositions: Cartesian3[]) => Promise<PlottedResult>;

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
  const viewer = useViewer();

  const scaffoldScope = useEntityScope({ collection: useDataSource(new CustomDataSource(`plotted-scaffold-${createGuid()}`)).value!.entities });
  const entityScope = useEntityScope({ collection: useDataSource(new CustomDataSource(`plotted-${createGuid()}`)).value!.entities });
  const primitiveScope = usePrimitiveScope({ collection: usePrimitive(new PrimitiveCollection()).value! });

  // 定义点回调
  let controlPointCallback: ((position: Cartesian3) => void) | undefined;

  // 定义控制点
  useScreenSpaceEventHandler({
    type: ScreenSpaceEventType.LEFT_CLICK,
    inputAction: ({ position }) => {
      if (controlPointCallback) {
        const cartesian = canvasCoordToCartesian(position, viewer.value!.scene);
        if (cartesian) {
          controlPointCallback?.(cartesian);
        }
      }
    },
  });

  let forceCancel: VoidFunction | undefined;

  const trigger = async (scheme: PlottedScheme) => {
    const { type, complete, completeOnDoubleClick, control, controlPositions, auxiliary, auxiliaryPositions, render } = scheme;

    let resolve: (result: PlottedResult) => void;
    const promise = new Promise<PlottedResult>((_resolve, _reject) => {
      resolve = _resolve;
      forceCancel = () => {
        forceCancel = undefined;
        _reject(new Error('Cancel plotted operation'));
      };
    });

    const udid = createGuid();
    const positions: Cartesian3[] = [];

    const positionsChanged = () => {
      const finish = complete?.([...positions]);
      if (finish) {
        controlPointCallback = undefined;
      }
    };

    const setPositions = (positon: Cartesian3[]) => {
      positionsChanged();
    };
    const addPosition = (positon: Cartesian3) => {};
    const removePosition = (index: number) => {};

    controlPointCallback = (position) => {
      positions.push(position);
      positionsChanged();
    };

    return {
      udid,
      type,
    };
  };

  return {
    trigger,
    cancel: () => forceCancel?.(),
  };
}
