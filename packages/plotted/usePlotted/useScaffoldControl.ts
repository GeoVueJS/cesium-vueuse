import type { Ref, ShallowRef } from 'vue';
import type { PlottedProduct } from './PlottedProduct';
import type { SmapledPlottedPackable } from './SmapledPlottedProperty';
import { useDataSource, useEntityScope, useGraphicEventHandler, useViewer } from '@cesium-vueuse/core';
import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { CustomDataSource, Entity } from 'cesium';
import { computed, reactive, watch } from 'vue';
import { PlottedAction } from './PlottedScaffold';
import { PlottedStatus } from './PlottedScheme';

export function useScaffoldControl(
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
      positions[index] = position;
      current.value!.smaple.setSample({
        time: packable.value.time,
        derivative: packable.value.derivative,
        positions,
      });
    },
  });

  const options = computed(() => current.value?.scheme.controlPoint);

  const positions = computed(() => {
    if (!current.value || !packable.value || current.value.status !== PlottedStatus.ACTIVE) {
      return [];
    }
    const positions = packable.value.positions ?? [];
    return options.value?.format?.(positions) ?? [];
  });

  watch([positions, () => highlightIds], ([positions]) => {
    const newList = positions?.map((position, index) => {
      const entity = entities.value[index] ?? new Entity();
      const merge = new Entity(options.value!.render?.({
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
