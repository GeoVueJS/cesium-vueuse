import type { Ref, ShallowRef } from 'vue';
import type { PlottedProduct } from './PlottedProduct';
import type { SmapledPlottedPackable } from './SmapledPlottedProperty';
import { useDataSource, useEntityScope, useGraphicEventHandler, useViewer } from '@cesium-vueuse/core';
import { canvasCoordToCartesian, isFunction } from '@cesium-vueuse/shared';
import { Cartesian3, CustomDataSource, Entity } from 'cesium';
import { computed, reactive, watch } from 'vue';
import { PlottedAction } from './PlottedScaffold';

export function useScaffoldInterval(
  current: ShallowRef<PlottedProduct | undefined>,
  packable: Ref<SmapledPlottedPackable<any> | undefined>,
) {
  const viewer = useViewer();
  const dataSource = useDataSource(new CustomDataSource());
  const entityScope = useEntityScope({ collection: () => dataSource.value!.entities });

  const entities = computed(() => [...entityScope.scope]);

  const highlightIds = reactive<Record<PlottedAction | any, string | undefined>>({
    [PlottedAction.ACTIVE]: undefined,
    [PlottedAction.HOVER]: undefined,
    [PlottedAction.OPERATING]: undefined,
  });

  /**
   * 根据点的ID获取对应的操作状态
   */
  const getPointAction = (id: string) => {
    return highlightIds[PlottedAction.OPERATING] === id
      ? PlottedAction.OPERATING
      : highlightIds[PlottedAction.ACTIVE] === id
        ? PlottedAction.ACTIVE
        : highlightIds[PlottedAction.HOVER] === id
          ? PlottedAction.HOVER
          : PlottedAction.IDLE;
  };

  useGraphicEventHandler({
    type: 'HOVER',
    graphic: entities,
    listener: (data) => {
      highlightIds[PlottedAction.HOVER] = data?.hover ? data.pick?.id?.id : undefined;
    },
  });

  useGraphicEventHandler({
    type: 'LEFT_CLICK',
    graphic: entities,
    listener: (data) => {
      const entity = data.pick?.id;
      highlightIds[PlottedAction.ACTIVE] = entities.value.includes(entity) ? entity?.id : undefined;
    },
  });

  useGraphicEventHandler({
    type: 'DRAG',
    graphic: entities,
    listener: (data) => {
      // lock camera
      viewer.value!.scene.screenSpaceCameraController.enableRotate = !data.draging;
      const id = data?.draging ? data.pick?.id?.id : undefined;
      highlightIds[PlottedAction.OPERATING] = id;
      if (id) {
        highlightIds[PlottedAction.ACTIVE] = id;
      }
    },
  });

  let dragIndex = -1;

  // 控制点拖拽
  useGraphicEventHandler({
    type: 'DRAG',
    graphic: entities,
    listener: (data) => {
      if (!packable.value) {
        return;
      }
      const position = canvasCoordToCartesian(data.context.endPosition, viewer.value!.scene!);
      if (!position) {
        return;
      }
      const entity = data.pick!.id;

      const index = entities.value.findIndex(e => e.id === entity.id);
      const positions = [...packable.value.positions ?? []];
      if (dragIndex === -1) {
        dragIndex = index;
        positions.splice(index + 1, 0, position);
      }
      else {
        positions[dragIndex + 1] = position;
      }
      if (!data.draging) {
        dragIndex = -1;
      }
      current.value!.smaple.setSample({
        time: packable.value.time,
        derivative: packable.value.derivative,
        positions,
      });
    },
  });

  const scaffold = computed(() => current.value?.scheme.intervalPoint);

  const positions = computed(() => {
    if (!current.value || !packable.value) {
      return [];
    }
    const _positions = packable.value.positions!;
    if (_positions.length < 2) {
      return [];
    }
    return _positions.map((position, i) => {
      const next = i === _positions.length - 1 ? _positions[0] : _positions[i + 1];
      return Cartesian3.midpoint(position, next, new Cartesian3());
    });
  });

  const disabled = computed(() => {
    return isFunction(scaffold.value?.diabled) ? scaffold.value.diabled(current.value!.status) : false;
  });

  watch([positions, () => highlightIds], ([positions]) => {
    if (disabled.value) {
      return;
    }
    const newList = positions?.map((position, index) => {
      const entity = entities.value[index] ?? new Entity();
      const merge = new Entity(scaffold.value!.render?.({
        packable: packable.value!,
        count: positions.length,
        index,
        position,
        status: current.value!.status,
        action: getPointAction(entity.id),
      }));

      // @ts-expect-error ignore
      merge.propertyNames.filter(key => key !== 'id').forEach(key => (entity[key] = merge[key]));
      entityScope.add(entity);
      return entity;
    });

    entityScope.removeWhere(entity => !newList?.includes(entity));
  }, {
    deep: true,
  });
}
