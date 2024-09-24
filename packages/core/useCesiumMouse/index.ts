import type { Cartesian2, Cartesian3 } from 'cesium';
import type { Ref } from 'vue';
import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { throttledRef } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { computed, shallowRef } from 'vue';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';
import { useViewer } from '../useViewer';

export interface UseCesiumMouseOptions {
  /**
   * Throttled sampling (ms)
   * @default 8
   */
  delay?: number;
}

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
 * Reactive Mouse coordinates
 */
export function useCesiumMouse(options: UseCesiumMouseOptions = {}): UseCesiumMouseRetrun {
  const { delay = 8 } = options;

  const viewer = useViewer();

  const coordinate = shallowRef<Cartesian2>();
  const coordinateThrottled = throttledRef<Cartesian2 | undefined>(coordinate, delay, false, true);

  useScreenSpaceEventHandler({
    type: ScreenSpaceEventType.MOUSE_MOVE,
    inputAction: (ctx) => {
      coordinate.value = ctx.endPosition.clone();
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
