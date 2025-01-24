import type { Cartesian2, ScreenSpaceEventHandler } from 'cesium';
import type { WatchStopHandle } from 'vue';
import type { TapType } from '.';
import { tryOnScopeDispose } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { shallowRef, watch } from 'vue';
import { useScenePick } from '../useScenePick';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';

 type PositiondScreenSpaceEventType =
   ScreenSpaceEventType.LEFT_DOWN |
   ScreenSpaceEventType.LEFT_UP |
   ScreenSpaceEventType.LEFT_CLICK |
   ScreenSpaceEventType.LEFT_DOUBLE_CLICK |
   ScreenSpaceEventType.RIGHT_DOWN |
   ScreenSpaceEventType.RIGHT_UP |
   ScreenSpaceEventType.RIGHT_CLICK |
   ScreenSpaceEventType.MIDDLE_DOWN |
   ScreenSpaceEventType.MIDDLE_UP |
   ScreenSpaceEventType.MIDDLE_CLICK;

/**
 * @internal
 */
const EVENT_TYPE_RECORD: Record<TapType, PositiondScreenSpaceEventType> = {
  LEFT_DOWN: ScreenSpaceEventType.LEFT_DOWN,
  LEFT_UP: ScreenSpaceEventType.LEFT_UP,
  LEFT_CLICK: ScreenSpaceEventType.LEFT_CLICK,
  LEFT_DOUBLE_CLICK: ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  RIGHT_DOWN: ScreenSpaceEventType.RIGHT_DOWN,
  RIGHT_UP: ScreenSpaceEventType.RIGHT_UP,
  RIGHT_CLICK: ScreenSpaceEventType.RIGHT_CLICK,
  MIDDLE_DOWN: ScreenSpaceEventType.MIDDLE_DOWN,
  MIDDLE_UP: ScreenSpaceEventType.MIDDLE_UP,
  MIDDLE_CLICK: ScreenSpaceEventType.MIDDLE_CLICK,
};

/**
 * Parameters for graphics click related events
 */
export interface GraphicTapParams {
  /**
   * Context of the picked area
   */
  context: ScreenSpaceEventHandler.PositionedEvent;
  /**
   * The graphic object picked by `scene.pick`
   */
  pick: any;
}

export function useTap(
  type: TapType,
  allow: (pick: any) => boolean,
  listener: (params: GraphicTapParams) => void,
): WatchStopHandle {
  const screenEvent = EVENT_TYPE_RECORD[type];

  const position = shallowRef<Cartesian2>();
  const pick = useScenePick(position);

  const stopTapWatch = useScreenSpaceEventHandler(screenEvent, (event) => {
    position.value = event.position.clone();
  });

  const stopWatch = watch([position, pick], ([position, pick]) => {
    pick && position && allow(pick) && listener({ context: { position }, pick });
  });

  const stop = () => {
    stopTapWatch();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return stop;
}
