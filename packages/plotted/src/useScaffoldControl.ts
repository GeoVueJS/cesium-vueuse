import type { Ref, ShallowRef } from 'vue';
import type { PlottedProduct } from './PlottedProduct';
import type { SmapledPlottedPackable } from './SmapledPlottedProperty';
import { useDataSource, useEntityScope, useGraphicEventHandler, useViewer } from '@cesium-vueuse/core';
import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { CustomDataSource, Entity } from 'cesium';
import { computed, reactive, watch, watchEffect } from 'vue';
import { PlottedPointAction } from './PlottedScheme';

export function useScaffoldControl(
  current: ShallowRef<PlottedProduct | undefined>,
  packable: Ref<SmapledPlottedPackable<any> | undefined>,
) {
  const viewer = useViewer();
  const dataSource = useDataSource(new CustomDataSource());
  const entityScope = useEntityScope({ collection: () => dataSource.value!.entities });

  const entities = computed(() => [...entityScope.scope]);

  watchEffect(() => {
    console.log(entities.value);
  });

  const highlightIds = reactive({
    activeId: undefined as string | undefined,
    hoverId: undefined as string | undefined,
    operatingId: undefined as string | undefined,
  });

  useGraphicEventHandler({
    type: 'HOVER',
    graphic: entities,
    listener: (data) => {
      highlightIds.hoverId = data?.hover ? data.pick?.id?.id : undefined;
    },
  });

  useGraphicEventHandler({
    type: 'LEFT_CLICK',
    graphic: entities,
    listener: (data) => {
      const entity = data.pick?.id;
      highlightIds.activeId = entities.value.includes(entity) ? entity?.id : undefined;
    },
  });

  useGraphicEventHandler({
    type: 'DRAG',
    graphic: entities,
    listener: (data) => {
      // lock camera
      viewer.value!.scene.screenSpaceCameraController.enableRotate = !data.draging;

      const entity = data?.draging ? data.pick?.id : undefined;
      highlightIds.activeId = entity?.id;
      highlightIds.operatingId = entity?.id;
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

  const positions = computed(
    () => {
      if (!current.value || !packable.value) {
        return [];
      }
      return options.value?.format?.(packable.value, current.value.status) ?? [];
    },
  );

  watch([positions, highlightIds], () => {
    const newList = positions.value?.map((position, index) => {
      const entity = entities.value[index] ?? new Entity();

      const merge = new Entity(options.value!.render?.({
        position,
        status: current.value!.status,
        action: PlottedPointAction.IDLE,
      }));

      merge.propertyNames.forEach((propertyName: any) => {
        if (propertyName !== 'id') {
          // @ts-expect-error merge[propertyName] is any
          entity[propertyName] = merge[propertyName];
        }
      });
      entityScope.add(entity);
      return entity;
    });

    entityScope.removeWhere(entity => !newList?.includes(entity));
  }, {
    deep: true,
  });
}
