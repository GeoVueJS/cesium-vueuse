import type { Ref, ShallowRef } from 'vue';

import type { PlottedProduct } from '../options/PlottedProduct';
import type { PlottedScaffold } from '../options/PlottedScaffold';
import type { PlottedStatus } from '../options/PlottedScheme';
import type { SmapledPlottedPackable } from '../options/SmapledPlottedProperty';
import { useCesiumEventListener, useDataSource, useEntityScope, useGraphicEventHandler, useViewer } from '@cesium-vueuse/core';
import { canvasCoordToCartesian, isFunction } from '@cesium-vueuse/shared';
import { Cartesian3, CustomDataSource, Entity } from 'cesium';
import { computed, ref, shallowRef, watch, watchEffect } from 'vue';
import { PlottedAction } from '../options/PlottedScaffold';

export function useScaffold(
  current: ShallowRef<PlottedProduct | undefined>,
  packable: Ref<SmapledPlottedPackable<any> | undefined>,
  scaffold: Ref<PlottedScaffold>,
) {
  const viewer = useViewer();
  const dataSource = useDataSource(new CustomDataSource());
  const entityScope = useEntityScope({ collection: () => dataSource.value!.entities });

  // 当前渲染的点位集合
  const entities = computed(() => [...entityScope.scope]);

  // 当前标绘状态
  const status = shallowRef<PlottedStatus>();

  watchEffect(() => {
    status.value = current.value?.status;
  });

  useCesiumEventListener(() => current.value?.statusChanged, () => {
    status.value = current.value?.status;
  });

  // 当前标绘是否禁用
  const disabled = computed(() => {
    return isFunction(scaffold.value?.diabled)
      ? scaffold.value!.diabled!(current.value!.status)
      : !!scaffold.value?.diabled;
  });

  // 格式化点位
  const positions = computed(() => {
    if (disabled.value) {
      return [];
    }
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

  // 当前鼠标hover的点id
  const hoverId = ref<string>();
  // 当前鼠标点击的点id
  const activeId = ref<string>();
  // 当前鼠标操作中的点id
  const operatingId = ref<string>();

  // 根据点的ID获取对应的操作状态
  const getPointAction = (id: string) => {
    return operatingId.value === id
      ? PlottedAction.OPERATING
      : activeId.value === id
        ? PlottedAction.ACTIVE
        : hoverId.value === id
          ? PlottedAction.HOVER
          : PlottedAction.IDLE;
  };

  useGraphicEventHandler({
    type: 'HOVER',
    graphic: entities,
    listener: (data) => {
      hoverId.value = data?.hover ? data.pick?.id?.id : undefined;
    },
  });

  useGraphicEventHandler({
    type: 'LEFT_CLICK',
    graphic: entities,
    listener: (data) => {
      const entity = data.pick?.id;
      activeId.value = entities.value.includes(entity) ? entity?.id : undefined;
    },
  });

  useGraphicEventHandler({
    type: 'DRAG',
    graphic: entities,
    listener: (data) => {
      const id = data?.draging ? data.pick?.id?.id : undefined;
      operatingId.value = id;
      activeId.value = id || activeId.value;
      // lock camera
      viewer.value!.scene.screenSpaceCameraController.enableRotate = !data.draging;
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

  watch([positions, activeId, hoverId, operatingId, disabled, status], ([positions]) => {
    if (disabled.value) {
      return;
    }
    const newList = positions.map((position, index) => {
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
      merge.propertyNames.filter(field => field !== 'id').forEach(field => (entity[field] = merge[field]));
      entityScope.add(entity);
      return entity;
    });
    entityScope.removeWhere(entity => !newList?.includes(entity));
  }, {
    deep: true,
  });
}
