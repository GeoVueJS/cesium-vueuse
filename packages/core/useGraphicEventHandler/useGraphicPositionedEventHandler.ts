import type { ScreenSpaceEventHandler } from 'cesium';
import type { PausableState } from '../createPausable';
import type { GraphicPositionedEventListener } from './types';
import { ScreenSpaceEventType } from 'cesium';
import { computed, shallowRef, toValue, watch } from 'vue';
import { createPausable } from '../createPausable';
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
  type?: GraphicPositiondEventType;
  listener?: GraphicPositionedEventListener;
  pause?: boolean;
}

export function useGraphicPositionedEventHandler(options: UseGraphicPositionedEventHandlerOptions): PausableState {
  const { type, listener, pause } = options;

  const pausable = createPausable(pause);
  const isActive = pausable.isActive;

  const typeRef = computed(() => {
    const typeStr = toValue(type);
    return typeStr ? EVENT_TYPE_RECORD[typeStr] : undefined;
  });

  const context = shallowRef<ScreenSpaceEventHandler.PositionedEvent>();

  useScreenSpaceEventHandler(typeRef, (event) => {
    context.value = {
      position: event.position.clone(),
    };
  });

  const pick = useScenePick(() => context.value?.position, { isActive });

  watch([context, pick], ([context, pick]) => {
    if (pick && context && listener) {
      listener({ context, pick });
    }
  });

  return pausable;
}
