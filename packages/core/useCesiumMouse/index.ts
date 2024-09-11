import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { createSharedComposable, throttledRef } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { computed, shallowRef } from 'vue';

import type { Cartesian2, Cartesian3 } from 'cesium';
import type { Ref } from 'vue';

import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';
import { useViewer } from '../useViewer';

export interface UseCesiumMouseRetrun {
  /**
   * Mouse coordinates on Cesium canvas
   */
  coordinate?: Readonly<Ref<Cartesian2 | undefined>>;
  /**
   * The Mouse Cartesian coordinates on Cesium canvas
   */
  position?: Readonly<Ref<Cartesian3 | undefined>>;
}

/**
 * The base function passed into createSharedComposable to create useCesiumMouse
 * @internal
 */
function _useCesiumMouse(): UseCesiumMouseRetrun {
  const viewer = useViewer();

  const coordinate = shallowRef<Cartesian2>();
  const coordinateThrottled = throttledRef<Cartesian2 | undefined>(coordinate, 16, false, true);

  useScreenSpaceEventHandler({
    type: ScreenSpaceEventType.MOUSE_MOVE,
    inputAction: (ctx) => {
      coordinate.value = ctx.endPosition;
    },
  });

  const position = computed(() => {
    if (viewer.value?.scene) {
      return coordinate.value ? canvasCoordToCartesian(coordinate.value, viewer.value.scene) : undefined;
    }
  });

  return {
    coordinate: coordinateThrottled,
    position,
  };
}

/**
 * Reactive Mouse coordinates
 */
export const useCesiumMouse: () => UseCesiumMouseRetrun = createSharedComposable(_useCesiumMouse);
