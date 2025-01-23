import type { ScreenSpaceEventHandler } from 'cesium';
import type { MaybeRefOrGetter, WatchStopHandle } from 'vue';
import type { GraphicPositionedEventListener } from './types';
import { ScreenSpaceEventType } from 'cesium';
import { shallowRef, toRef, watch } from 'vue';
import { useScenePick } from '../useScenePick';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';

export type GraphicPositiondEventType =
  'LEFT_DOWN' |
  'LEFT_UP' |
  'LEFT_CLICK' |
  'LEFT_DOUBLE_CLICK' |
  'RIGHT_DOWN' |
  'RIGHT_UP' |
  'RIGHT_CLICK' |
  'MIDDLE_DOWN' |
  'MIDDLE_UP' |
  'MIDDLE_CLICK';

/**
 * @internal
 */
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
const EVENT_TYPE_RECORD: Record<GraphicPositiondEventType, PositiondScreenSpaceEventType> = {
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

export interface UseGraphicPositionedEventHandlerOptions {

  /**
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
}

export function useGraphicPositionedEventHandler(
  type: GraphicPositiondEventType,
  listener: GraphicPositionedEventListener,
  options: UseGraphicPositionedEventHandlerOptions,
): WatchStopHandle {
  const isActive = toRef(options.isActive ?? true);
  const screenEvent = EVENT_TYPE_RECORD[type];
  const context = shallowRef<ScreenSpaceEventHandler.PositionedEvent>();

  const cleanup1 = useScreenSpaceEventHandler(screenEvent, (event) => {
    context.value = {
      position: event.position.clone(),
    };
  });

  const pick = useScenePick(() => context.value?.position, { isActive });

  const cleanup2 = watch(
    [context, pick],
    ([context, pick]) => {
      pick && context && listener({ context, pick });
    },
  );

  return () => {
    cleanup1();
    cleanup2();
  };
}
