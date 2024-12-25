import type { UseEntityScopeRetrun, UsePrimitiveScopeRetrun } from '@cesium-vueuse/core';
import type { JulianDate } from 'cesium';
import type { ShallowRef } from 'vue';
import type { PlottedProduct } from './PlottedProduct';
import { useCesiumEventListener, useDataSource, useEntityScope, usePrimitive, usePrimitiveScope, useScreenSpaceEventComputed, useViewer } from '@cesium-vueuse/core';
import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { CustomDataSource, PrimitiveCollection, ScreenSpaceEventType } from 'cesium';
import { watch } from 'vue';

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

  const mouse = useScreenSpaceEventComputed(ScreenSpaceEventType.MOUSE_MOVE, (ctx) => {
    return ctx ? canvasCoordToCartesian(ctx?.endPosition, viewer.value!.scene) : undefined;
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

  useCesiumEventListener(
    () => [
      current.value?.statusChanged,
      current.value?.smaple.definitionChanged,
    ],
    () => render(),
  );

  watch(mouse, () => render());

  return {
    primitiveScope,
    entityScope,
  };
}
