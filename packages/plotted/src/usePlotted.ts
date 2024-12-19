import type { Cartesian3 } from 'cesium';
import type { ShallowRef } from 'vue';
import type { PlottedProductConstructorOptions } from './PlottedProduct';
import { useCesiumEventListener } from '@cesium-vueuse/core/useCesiumEventListener';
import { useDataSource } from '@cesium-vueuse/core/useDataSource';
import { useEntityScope } from '@cesium-vueuse/core/useEntityScope';
import { usePrimitive } from '@cesium-vueuse/core/usePrimitive';
import { usePrimitiveScope } from '@cesium-vueuse/core/usePrimitiveScope';
import { useScreenSpaceEventHandler } from '@cesium-vueuse/core/useScreenSpaceEventHandler';
import { useViewer } from '@cesium-vueuse/core/useViewer';
import { canvasCoordToCartesian, isString } from '@cesium-vueuse/shared';
import { createGuid, CustomDataSource, JulianDate, PrimitiveCollection, ScreenSpaceEventType } from 'cesium';
import { shallowReactive, shallowRef, watch } from 'vue';
import { PlottedProduct } from './PlottedProduct';
import { PlottedStatus } from './PlottedScheme';

export * from './PlottedProduct';
export * from './PlottedScheme';
export * from './SmapledPlottedProperty';

export interface UsePlottedOptions {

}

export type UsePlottedExecute = (product: string | PlottedProduct | PlottedProductConstructorOptions) => Promise<PlottedProduct>;

export interface UsePlottedRetrun {

  time: ShallowRef<JulianDate>;

  data?: ShallowRef<PlottedProduct[]>;

  current?: ShallowRef<PlottedProduct | undefined>;
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
  const time = shallowRef(JulianDate.now());

  const syncTime = shallowRef(false);

  const viewer = useViewer();

  const getCurrentTime = () => {
    return syncTime.value ? viewer.value!.clock.currentTime.clone() : time.value.clone();
  };

  const scaffoldDataSource = useDataSource(new CustomDataSource(`plotted-scaffold-${createGuid()}`));
  const entityDataSource = useDataSource(new CustomDataSource(`plotted-${createGuid()}`));

  const scaffoldScope = useEntityScope({ collection: () => scaffoldDataSource.value!.entities });
  const entityScope = useEntityScope({ collection: () => entityDataSource.value!.entities });
  const primitiveScope = usePrimitiveScope({ collection: usePrimitive(new PrimitiveCollection()).value! });

  const data = shallowReactive<PlottedProduct[]>([]);

  const current = shallowRef<PlottedProduct>();

  const mouse = shallowRef<Cartesian3>();

  useScreenSpaceEventHandler({
    type: ScreenSpaceEventType.MOUSE_MOVE,
    inputAction: (ctx) => {
      const position = canvasCoordToCartesian(ctx.endPosition, viewer.value!.scene);
      if (position) {
        mouse.value = position;
      }
    },
  });

  const render = async () => {
    const result = await current.value!.scheme.render?.({
      packable: current.value!.smaple.getValue(getCurrentTime()),
      mouse: mouse.value,
      status: current.value!.status,
      prev: {
        entities: current.value!.entities,
        primitives: current.value!.primitives,
      },
    });
    const entities = result?.entities || [];
    const primitives = result?.primitives || [];

    current.value!.entities.forEach((entity) => {
      if (!entities.includes(entity)) {
        entityScope.remove(entity);
      }
    });
    current.value!.primitives.forEach((primitive) => {
      if (!primitives.includes(primitive)) {
        primitiveScope.remove(primitive);
      }
    });
    current.value!._entities = [...entities];
    current.value!._primitives = [...primitives];
    entities.forEach(entity => entityScope.add(entity));
    primitives.forEach(primitive => primitiveScope.add(primitive));
  };

  useCesiumEventListener(() => current.value?.smaple.definitionChanged, () => render());
  useCesiumEventListener(() => current.value?.statusChanged, () => render());
  watch(mouse, () => current.value?.status === PlottedStatus.DEFINING && render());

  useScreenSpaceEventHandler({
    type: ScreenSpaceEventType.LEFT_CLICK,
    inputAction: (ctx) => {
      if (!current.value) {
        return;
      }
      const { scheme, status, smaple } = current.value;
      if (status !== PlottedStatus.DEFINING) {
        return;
      }
      const position = canvasCoordToCartesian(ctx.position, viewer.value!.scene);
      if (!position) {
        return;
      }
      const packable = smaple.getValue(getCurrentTime());
      packable.positions ??= [];
      packable.positions.push(position);
      smaple.setSample(packable);
      const completed = scheme.complete?.(packable.positions);
      completed && current.value.setStatus(PlottedStatus.ACTIVE);
    },
  });

  useScreenSpaceEventHandler({
    type: ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    inputAction: (ctx) => {
      // 双击结束定义态,进入激活态
      if (!current.value) {
        return;
      }
      const { scheme, status, smaple } = current.value;
      if (status !== PlottedStatus.DEFINING) {
        return;
      }
      const position = canvasCoordToCartesian(ctx.position, viewer.value!.scene);
      if (!position) {
        return;
      }
      const packable = smaple.getValue(getCurrentTime());
      packable.positions ??= [];
      packable.positions.push(position);
      smaple.setSample(packable);
      const completed = scheme.completeOnDoubleClick?.(packable.positions);
      completed && current.value.setStatus(PlottedStatus.ACTIVE);
    },
  });

  const execute: UsePlottedExecute = async (product) => {
    const result = isString(product)
      ? new PlottedProduct({ scheme: product })
      : product instanceof PlottedProduct
        ? product
        : new PlottedProduct(product);
    current.value = result;
    return result;
  };

  const cancel = () => {
  };

  return {
    execute,
    cancel,
  };
}
