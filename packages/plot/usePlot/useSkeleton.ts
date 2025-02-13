import type { JulianDate } from 'cesium';
import type { ComputedRef, ShallowRef } from 'vue';
import type { Plot } from './Plot';
import type { PlotSkeleton } from './PlotSkeleton';
import { useCesiumEventListener, useDataSource, useEntityScope, useGraphicDrag, useGraphicHover, useGraphicLeftClick, useViewer } from '@cesium-vueuse/core';
import { arrayDifference, isFunction, throttle } from '@cesium-vueuse/shared';
import { onKeyStroke, watchArray } from '@vueuse/core';
import { CustomDataSource } from 'cesium';
import { shallowRef, toValue, watch } from 'vue';
import { PlotAction } from './PlotSkeleton';
import { PlotSkeletonEntity } from './PlotSkeletonEntity';

export function useSkeleton(
  plots: ComputedRef<Plot[]>,
  current: ShallowRef<Plot | undefined>,
  getCurrentTime: () => JulianDate,
) {
  const viewer = useViewer();

  const dataSource = useDataSource(new CustomDataSource());
  const entityScope = useEntityScope({ collection: () => dataSource.value!.entities });

  const hoverEntity = shallowRef<PlotSkeletonEntity>();
  const activeEntity = shallowRef<PlotSkeletonEntity>();

  // 获取当前点位的状态
  const getPointAction = (entity?: PlotSkeletonEntity) => {
    if (!entity) {
      return PlotAction.IDLE;
    }
    return activeEntity.value?.id === entity.id
      ? PlotAction.ACTIVE
      : hoverEntity.value?.id === entity.id
        ? PlotAction.HOVER
        : PlotAction.IDLE;
  };

  const update = throttle((plot: Plot, destroyed?: boolean) => {
    const oldEntities = plot.getSkeletonEntities();
    const entities: PlotSkeletonEntity[] = [];

    if (destroyed || plot.disabled) {
      plot.skeletonEntities = [];
    }
    else {
      const packable = plot.sample.getValue(getCurrentTime());
      const defining = plot.defining;
      const active = current.value === plot;
      const skeletons = plot.scheme.skeletons;

      skeletons.forEach((skeleton) => {
        const diabled = isFunction(skeleton.diabled) ? skeleton.diabled({ active, defining }) : skeleton.diabled;
        if (diabled) {
          return;
        }
        const positions = skeleton.format?.(packable!) ?? packable?.positions ?? [];

        positions.forEach((position, index) => {
          let entity = oldEntities.find(item => item.index === index && item.skeleton === skeleton);
          const options = skeleton.render?.({
            defining,
            active,
            index,
            packable,
            positions,
            position,
            action: getPointAction(entity),
          });

          const merge = new PlotSkeletonEntity(options ?? {});
          if (entity) {
            merge.propertyNames.forEach((key) => {
              if (key !== 'id') {
                // @ts-expect-error ignore
                entity[key] = merge[key];
              }
            });
          }
          else {
            entity = merge;
          }
          entity.plot = plot;
          entity.skeleton = skeleton;
          entity.index = index;
          entities.push(entity);
        });
      });
    }
    plot.skeletonEntities = entities;
  }, 1);

  // cursor 仅在不存在定义态的标绘时才生效
  useGraphicDrag({
    cursor: (pick) => {
      if (!current.value?.defining && entityScope.scope.has(pick.id)) {
        const skeleton = pick.id.skeleton as PlotSkeleton;
        return isFunction(skeleton?.cursor) ? skeleton.cursor(pick) : toValue(skeleton?.cursor);
      }
    },
    dragCursor: (pick) => {
      if (!current.value?.defining && entityScope.scope.has(pick.id)) {
        const skeleton = pick.id.skeleton as PlotSkeleton;
        return isFunction(skeleton?.dragCursor) ? skeleton.dragCursor(pick) : toValue(skeleton?.dragCursor);
      }
    },
    listener: (params) => {
      if (params.pick.id instanceof PlotSkeletonEntity && entityScope.scope.has(params.pick.id)) {
        const entity = params.pick.id as PlotSkeletonEntity;

        const plot = entity.plot as Plot;
        // 仅在非定义态时才可拖拽
        if (plot.defining) {
          return;
        }
        activeEntity.value = entity;
        const skeleton = entity.skeleton as PlotSkeleton;
        const index = entity.index as number;
        const packable = plot.sample.getValue(getCurrentTime());
        skeleton.onDrag?.({
          viewer: viewer.value!,
          sample: plot.sample,
          packable,
          active: current.value === plot,
          index,
          context: params.context,
          dragging: params.dragging,
          lockCamera: params.lockCamera,
        });
      }
      else {
        activeEntity.value = undefined;
      }
    },
  });

  // 键盘控制当前激活的点位
  onKeyStroke((keyEvent) => {
    if (activeEntity.value) {
      const entity = activeEntity.value;
      const plot = entity.plot as Plot;
      const skeleton = entity.skeleton as PlotSkeleton;
      const index = entity.index as number;
      const packable = plot.sample.getValue(getCurrentTime());

      skeleton.onKeyPressed?.({
        viewer: viewer.value!,
        sample: plot.sample,
        packable,
        index,
        keyEvent,
      });
    }
  });

  useGraphicHover({
    listener: ({ hovering, pick }) => {
      if (hovering && pick.id instanceof PlotSkeletonEntity && entityScope.scope.has(pick.id)) {
        const entity = pick.id as PlotSkeletonEntity;
        hoverEntity.value = entity;
      }
      else {
        hoverEntity.value = undefined;
      }
    },
  });

  // 左键点击，令点位处于激活
  useGraphicLeftClick({
    listener: ({ context, pick }) => {
      if (pick.id instanceof PlotSkeletonEntity && entityScope.scope.has(pick.id)) {
        const entity = pick.id as PlotSkeletonEntity;
        activeEntity.value = entity;
        const plot = entity.plot as Plot;
        const skeleton = entity.skeleton as PlotSkeleton;
        const index = entity.index as number;

        const packable = plot.sample.getValue(getCurrentTime());

        skeleton.onLeftClick?.({
          viewer: viewer.value!,
          sample: plot.sample,
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

  watchArray(plots, (value, oldValue, added, removed = []) => {
    added.forEach(plot => update(plot));
    removed.forEach(plot => update(plot, true));
  });

  useCesiumEventListener(() => plots.value.map(plot => plot.definitionChanged), (plot, key, newValue, oldValue) => {
    if (['disabled', 'defining', 'scheme', 'sample', 'time'].includes(key)) {
      update(plot);
    }
    if (key === 'skeletonEntities') {
      const { added, removed } = arrayDifference(newValue as PlotSkeletonEntity[], oldValue as PlotSkeletonEntity[]);
      added.forEach(item => entityScope.add(item));
      removed.forEach(item => entityScope.remove(item));
    }
  });

  // 当前激活的标绘变化时，更新渲染
  watch(current, (plot, previous) => {
    plot && update(plot);
    setTimeout(() => {
      previous && update(previous);
    }, 2);
  });

  return {
    dataSource,
  };
}
