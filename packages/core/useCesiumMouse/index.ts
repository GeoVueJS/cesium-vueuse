import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { createSharedComposable, throttledRef } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { computed, shallowRef } from 'vue';

import type { Cartesian2, Cartesian3 } from 'cesium';
import type { Ref } from 'vue';

import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';
import { useViewer } from '../useViewer';

function _useCesiumMouse(): UseCesiumMouseRetrun {
  const viewer = useViewer();

  const _coordinate = shallowRef<Cartesian2>();

  useScreenSpaceEventHandler({
    type: ScreenSpaceEventType.MOUSE_MOVE,
    inputAction: (ctx) => {
      _coordinate.value = ctx.endPosition;
    },
  });

  const coordinate = throttledRef(_coordinate, 16, false, true);

  const position = computed(() => {
    return coordinate.value ? canvasCoordToCartesian(coordinate.value, viewer.value.scene) : undefined;
  });

  return {
    coordinate,
    position,
  };
}
export interface UseCesiumMouseRetrun {
  /**
   * 鼠标在Cesium画布的坐标
   */
  coordinate?: Readonly<Ref<Cartesian2 | undefined>>;
  /**
   * 鼠标在Cesium场景中的坐标对应的笛卡尔坐标
   */
  position?: Readonly<Ref<Cartesian3 | undefined>>;
}

/**
 * Cesium鼠标位置
 *
 * @returns 返回Cesium鼠标相关信息对象
 */
export const useCesiumMouse: () => UseCesiumMouseRetrun = createSharedComposable(_useCesiumMouse);
