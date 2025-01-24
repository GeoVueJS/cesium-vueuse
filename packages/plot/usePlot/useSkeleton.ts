import type { JulianDate } from 'cesium';
import type { ComputedRef, ShallowRef } from 'vue';
import type { Plot } from './Plot';
import type { PlotSkeleton } from './PlotSkeleton';
import { useCesiumEventListener, useDataSource, useEntityScope, useGraphicDrag, useGraphicHover, useGraphicLeftClick, useViewer } from '@cesium-vueuse/core';
import { isFunction, throttle } from '@cesium-vueuse/shared';
import { watchArray } from '@vueuse/core';
import { CustomDataSource, Entity } from 'cesium';
import { shallowRef, toValue } from 'vue';
import { PlotAction } from './PlotSkeleton';

export function useSkeleton(
  plots: ComputedRef<Plot[]>,
  current: ShallowRef<Plot | undefined>,
  getCurrentTime: () => JulianDate,
) {
  const viewer = useViewer();

  const dataSource = useDataSource(new CustomDataSource());
  const entityScope = useEntityScope({ collection: () => dataSource.value!.entities });

  const skeletonMap = new Map<Plot, PlotSkeleton[]>();

  watchArray(plots, (_value, _oldValue, added, removed = []) => {
    added.forEach((plot) => {
      const skeletons = plot.scheme.skeletons?.map(fn => fn()) ?? [];
      skeletonMap.set(plot, skeletons);
    });
    removed.forEach(plot => skeletonMap.delete(plot));
  });

  const hoverEntity = shallowRef<Entity>();
  const activeEntity = shallowRef<Entity>();
  const operatingEntity = shallowRef<Entity>();

  const getPointAction = (entity?: Entity) => {
    if (!entity) {
      return PlotAction.IDLE;
    }
    return hoverEntity.value?.id === entity.id
      ? PlotAction.OPERATING
      : activeEntity.value?.id === entity.id
        ? PlotAction.ACTIVE
        : operatingEntity.value?.id === entity.id
          ? PlotAction.HOVER
          : PlotAction.IDLE;
  };

  const entityMap = new Map<Plot, Entity[]>();

  const updated = throttle((plot: Plot, destroyed?: boolean) => {
    const previous = entityMap.get(plot) ?? [];

    const entities: Entity[] = [];

    if (!destroyed && !plot.disabled) {
      const packable = plot.smaple.getValue(getCurrentTime());
      const defining = plot.defining;
      const active = current.value === plot;

      skeletonMap.get(plot)?.forEach((skeleton) => {
        const diabled = isFunction(skeleton.diabled) ? skeleton.diabled({ active, defining }) : skeleton.diabled;
        if (diabled) {
          return;
        }
        const positions = skeleton.format?.(packable!) ?? packable?.positions ?? [];

        positions.forEach((position, index) => {
          const entity = previous.find(item => item.properties?.index?.getValue() === index && item.properties?.skeleton?.getValue() === skeleton);
          const options = skeleton.render?.({
            defining,
            active,
            index,
            packable,
            positions,
            position,
            action: getPointAction(entity),
          });
          const merge = new Entity({
            ...options,
            properties: {
              plot,
              skeleton,
              index,
            },
          });

          if (entity) {
            merge.propertyNames.forEach((key) => {
              if (key !== 'id') {
                // @ts-expect-error ignore
                entity[key] = merge[key];
              }
            });
          }
          entities.push(entity ?? merge);
        });
      });

      entityMap.set(plot, entities);
    }
    else {
      entityMap.delete(plot);
    }

    previous.forEach((entity) => {
      if (!entities.includes(entity)) {
        entityScope.remove(entity);
      };
    });

    entities.forEach((entity) => {
      entityScope.add(entity);
    });
  }, 10);

  // cursor 仅在不存在定义态的标绘时才生效
  useGraphicDrag({
    cursor: (pick) => {
      if (!current.value?.defining && entityScope.scope.has(pick.id)) {
        const skeleton = pick.id?.properties?.skeleton?.getValue() as PlotSkeleton;
        return isFunction(skeleton?.cursor) ? skeleton.cursor(pick) : toValue(skeleton?.cursor);
      }
    },
    dragCursor: (pick) => {
      if (!current.value?.defining && entityScope.scope.has(pick.id)) {
        const skeleton = pick.id?.properties?.skeleton?.getValue() as PlotSkeleton;
        return isFunction(skeleton?.dragCursor) ? skeleton.dragCursor(pick) : toValue(skeleton?.dragCursor);
      }
    },
    listener: (params) => {
      if (params.pick.id instanceof Entity && entityScope.scope.has(params.pick.id)) {
        const entity = params.pick.id as Entity;
        operatingEntity.value = params.dragging ? entity : undefined;
        activeEntity.value = entity;

        const plot = entity.properties?.plot?.getValue() as Plot;
        const skeleton = entity.properties?.skeleton?.getValue() as PlotSkeleton;
        const index = entity.properties?.index?.getValue() as number;
        const packable = plot.smaple.getValue(getCurrentTime());
        skeleton.onDrag?.({
          viewer: viewer.value!,
          smaple: plot.smaple,
          packable,
          defining: plot.defining,
          active: current.value === plot,
          index,
          context: params.context,
          dragging: params.dragging,
          lockCamera: params.lockCamera,
        });
      }
      else {
        operatingEntity.value = undefined;
      }
    },
  });

  useGraphicHover({
    listener: ({ hovering, pick }) => {
      if (hovering && pick.id instanceof Entity && entityScope.scope.has(pick.id)) {
        const entity = pick.id as Entity;
        hoverEntity.value = entity;
      }
      else {
        hoverEntity.value = undefined;
      }
    },
  });

  useGraphicLeftClick({
    listener: ({ context, pick }) => {
      if (pick.id instanceof Entity && entityScope.scope.has(pick.id)) {
        const entity = pick.id as Entity;
        activeEntity.value = entity;
        const plot = entity.properties?.plot?.getValue() as Plot;
        const skeleton = entity.properties?.skeleton?.getValue() as PlotSkeleton;
        const index = entity.properties?.plot?.getValue() as number;

        const packable = plot.smaple.getValue(getCurrentTime());

        skeleton.onLeftClick?.({
          viewer: viewer.value!,
          smaple: plot.smaple,
          packable: packable!,
          active: current.value === plot,
          defining: plot.defining,
          index,
          context,
        });
      }
      else {
        activeEntity.value = undefined;
      }
    },
  });

  watchArray(plots, (_value, _oldValue, added, removed = []) => {
    added.forEach(plot => updated(plot));
    removed.forEach(plot => updated(plot, true));
  });

  useCesiumEventListener(() => plots.value.map(plot => plot.definitionChanged), (plot, key) => {
    if (['disabled', 'defining', 'scheme', 'smaple', 'time'].includes(key)) {
      updated(plot);
    }
  });

  return {
    skeletonDataSources: dataSource,
  };
}
