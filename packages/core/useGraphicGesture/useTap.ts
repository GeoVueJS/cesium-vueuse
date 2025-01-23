import type { Arrayable } from '@vueuse/core';
import type { ScreenSpaceEventHandler } from 'cesium';
import type { MaybeRefOrGetter, WatchStopHandle } from 'vue';
import { pickHitGraphic } from '@cesium-vueuse/shared';
import { ScreenSpaceEventType } from 'cesium';
import { computed, shallowRef, toRef, toValue, watch } from 'vue';
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

export interface UseGraphicPositionedEventHandlerOptions {

  type: GraphicPositiondEventType;

  /**
   * Event listener.
   */
  listener: (params: GraphicTapParams) => void;

  /**
   * Graphic to be listened, the event will be triggered on all graphics when if null.
   */
  graphic?: MaybeRefOrGetter<Arrayable<any>>;

  /**
   * Predicate function to determine whether the event is allowed.
   */
  predicate?: (pick: any) => boolean;

  /**
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
}

export function useGraphicPositionedEventHandler(
  options: UseGraphicPositionedEventHandlerOptions,
): WatchStopHandle {
  const { type, listener, predicate, graphic } = options;

  const isActive = toRef(options.isActive ?? true);
  const screenEvent = EVENT_TYPE_RECORD[type];

  const graphicList = computed(() => {
    const value = toValue(graphic);
    return value ? Array.isArray(value) ? value : [value] : undefined;
  });

  const isEventAllowed = (pick: any) => {
    let allow = predicate?.(pick) ?? true;
    if (graphicList.value && !pickHitGraphic(pick, graphicList)) {
      allow = false;
    }
    return allow;
  };

  const context = shallowRef<ScreenSpaceEventHandler.PositionedEvent>();

  const stopTapWatch = useScreenSpaceEventHandler(screenEvent, (event) => {
    context.value = {
      position: event.position.clone(),
    };
  });

  const pick = useScenePick(() => context.value?.position, { isActive });

  const stopWatch = watch(
    [context, pick],
    ([context, pick]) => {
      pick && context && isEventAllowed(pick) && listener({ context, pick });
    },
  );

  return () => {
    stopTapWatch();
    stopWatch();
  };
}
