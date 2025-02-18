import type { Cartesian3, Entity, JulianDate } from 'cesium';
import type { ComputedRef, ShallowRef } from 'vue';
import type { Plot } from './Plot';
import { useCesiumEventListener, useDataSource, useEntityScope, usePrimitive, usePrimitiveScope, useScreenSpaceEventHandler, useViewer } from '@vesium/core';
import { arrayDifference, canvasCoordToCartesian, throttle } from '@vesium/shared';
import { watchArray } from '@vueuse/core';
import { CustomDataSource, PrimitiveCollection, ScreenSpaceEventType } from 'cesium';
import { computed, shallowRef, watch } from 'vue';

export interface UseProductRetrun {
  primitives: ComputedRef<any[]>;
  entities: ComputedRef<Entity[]>;
  groundPrimitives: ComputedRef<any[]>;
}

export function useRender(
  plots: ComputedRef<Plot[]>,
  current: ShallowRef<Plot | undefined>,
  getCurrentTime: () => JulianDate,
): UseProductRetrun {
  const viewer = useViewer();

  const primitiveCollection = usePrimitive(new PrimitiveCollection())!;
  const groundPrimitiveCollection = usePrimitive(new PrimitiveCollection(), { collection: 'ground' })!;
  const dataSource = useDataSource(new CustomDataSource());

  const entityScope = useEntityScope({ collection: () => dataSource.value!.entities });
  const primitiveScope = usePrimitiveScope({ collection: () => primitiveCollection.value! });
  const groundPrimitiveScope = usePrimitiveScope({ collection: () => groundPrimitiveCollection.value! });

  const mouseCartesian = shallowRef<Cartesian3>();

  useScreenSpaceEventHandler(
    ScreenSpaceEventType.MOUSE_MOVE,
    throttle((context) => {
      mouseCartesian.value = canvasCoordToCartesian(context?.endPosition, viewer.value!.scene);
    }, 10),
  );

  watchArray(plots, (_value, _oldValue, added, removed = []) => {
    removed.forEach((plot) => {
      entityScope.removeWhere(item => plot.entities.includes(item));
      primitiveScope.removeWhere(item => plot.primitives.includes(item));
      groundPrimitiveScope.removeWhere(item => plot.groundPrimitives.includes(item));
    });

    added.forEach((plot) => {
      plot.entities.forEach(item => entityScope.add(item));
      plot.primitives.forEach(item => primitiveScope.add(item));
      plot.groundPrimitives.forEach(item => groundPrimitiveScope.add(item));
    });
  }, {
    immediate: true,
  });

  useCesiumEventListener(
    () => plots.value.map(item => item.definitionChanged),
    (_scope, key, newValue, oldValue) => {
      if (key === 'entities') {
        const { added, removed } = arrayDifference(newValue as Entity[], oldValue as Entity[]);
        added.forEach(item => entityScope.add(item));
        removed.forEach(item => entityScope.remove(item));
      }
      else if (key === 'primitives') {
        const { added, removed } = arrayDifference(newValue as Entity[], oldValue as Entity[]);
        added.forEach(item => primitiveScope.add(item));
        removed.forEach(item => primitiveScope.remove(item));
      }
      else if (key === 'groundPrimitives') {
        const { added, removed } = arrayDifference(newValue as Entity[], oldValue as Entity[]);
        added.forEach(item => groundPrimitiveScope.add(item));
        removed.forEach(item => groundPrimitiveScope.remove(item));
      }
    },
  );

  const update = throttle(async (plot: Plot) => {
    const reslut = await plot.scheme.render?.({
      packable: plot.sample.getValue(getCurrentTime()),
      mouse: plot.defining ? mouseCartesian.value : undefined,
      defining: plot.defining,
      previous: {
        entities: plot.entities,
        primitives: plot.primitives,
        groundPrimitives: plot.groundPrimitives,
      },
    });

    plot.entities = reslut?.entities ?? [];
    plot.primitives = reslut?.primitives ?? [];
    plot.groundPrimitives = reslut?.groundPrimitives ?? [];
  }, 1);

  watch(current, (plot, previous) => {
    previous && update(previous);
  });

  useCesiumEventListener(
    () => plots.value.map(item => item.definitionChanged),
    (plot, key) => {
      if (['disabled', 'defining', 'scheme', 'sample', 'time'].includes(key)) {
        update(plot);
      }
    },
  );

  watch(mouseCartesian, () => {
    plots.value.forEach(plot => plot.defining && update(plot));
  });

  return {
    primitives: computed(() => Array.from(primitiveScope.scope)),
    groundPrimitives: computed(() => Array.from(primitiveScope.scope)),
    entities: computed(() => Array.from(entityScope.scope)),
  };
}
