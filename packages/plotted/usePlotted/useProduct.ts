import type { UseEntityScopeRetrun, UsePrimitiveScopeRetrun } from '@cesium-vueuse/core';
import type { Cartesian3, JulianDate } from 'cesium';
import type { ShallowRef } from 'vue';
import type { PlottedProduct } from '../options/PlottedProduct';
import { useCesiumEventListener, useDataSource, useEntityScope, usePrimitive, usePrimitiveScope, useScreenSpaceEventHandler, useViewer } from '@cesium-vueuse/core';
import { canvasCoordToCartesian, throttle } from '@cesium-vueuse/shared';
import { CustomDataSource, PrimitiveCollection, ScreenSpaceEventType } from 'cesium';
import { shallowRef, watch } from 'vue';
import { PlottedStatus } from '../options/PlottedScheme';

export interface UseProductOptions {
}

export interface UseProductRetrun {
  primitiveScope: UsePrimitiveScopeRetrun;
  entityScope: UseEntityScopeRetrun;
}

export function useProduct(
  current: ShallowRef<PlottedProduct | undefined>,
  getCurrentTime: () => JulianDate,
): UseProductRetrun {
  const viewer = useViewer();

  const primitiveCollection = usePrimitive(new PrimitiveCollection())!;
  const dataSource = useDataSource(new CustomDataSource());
  const primitiveScope = usePrimitiveScope({ collection: () => primitiveCollection.value! });
  const entityScope = useEntityScope({ collection: () => dataSource.value!.entities });

  const mouseCartesian = shallowRef<Cartesian3>();

  useScreenSpaceEventHandler(
    ScreenSpaceEventType.MOUSE_MOVE,
    throttle((context) => {
      mouseCartesian.value = canvasCoordToCartesian(context?.endPosition, viewer.value!.scene);
    }, 10),
  );

  const render = async () => {
    const result = await current.value!.scheme.render?.({
      packable: current.value!.smaple.getValue(getCurrentTime()),
      mouse: current.value!.status === PlottedStatus.DEFINING ? mouseCartesian.value : undefined,
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

  useCesiumEventListener([
    () => current.value?.statusChanged,
    () => current.value?.smaple.definitionChanged,
  ], () => render());

  watch(mouseCartesian, () => render());

  return {
    primitiveScope,
    entityScope,
  };
}
