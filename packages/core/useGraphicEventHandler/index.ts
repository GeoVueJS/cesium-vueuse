import type { MaybeRefOrGetter } from 'vue';
import type { PausableState } from '../createPausable';
import type { GraphicDragEventParams, GraphicHoverEventParams, GraphicPositionedEventParams } from './types';
import { computed, toValue, watchEffect } from 'vue';
import { createPausable } from '../createPausable';
import { useGraphicDragEventHandler } from './useGraphicDragEventHandler';
import { useGraphicHoverEventHandler } from './useGraphicHoverEventHandler';
import { useGraphicPositionedEventHandler } from './useGraphicPositionedEventHandler';

/**
 * All mouse event type
 */
export type GraphicEventType =
  'LEFT_DOWN' |
  'LEFT_UP' |
  'LEFT_CLICK' |
  'LEFT_DOUBLE_CLICK' |
  'RIGHT_DOWN' |
  'RIGHT_UP' |
  'RIGHT_CLICK' |
  'MIDDLE_DOWN' |
  'MIDDLE_UP' |
  'MIDDLE_CLICK' |
  'HOVER' |
  'DRAG';

export type GraphicEventParams<T extends GraphicEventType> = {
  LEFT_DOWN: GraphicPositionedEventParams;
  LEFT_UP: GraphicPositionedEventParams;
  LEFT_CLICK: GraphicPositionedEventParams;
  LEFT_DOUBLE_CLICK: GraphicPositionedEventParams;
  RIGHT_DOWN: GraphicPositionedEventParams;
  RIGHT_UP: GraphicPositionedEventParams;
  RIGHT_CLICK: GraphicPositionedEventParams;
  MIDDLE_DOWN: GraphicPositionedEventParams;
  MIDDLE_UP: GraphicPositionedEventParams;
  MIDDLE_CLICK: GraphicPositionedEventParams;
  HOVER: GraphicHoverEventParams;
  DRAG: GraphicDragEventParams;
}[T];

export interface UseGraphicEventHandlerOptions<T extends GraphicEventType> {
  /**
   * Gesture Event Type
   */
  type?: MaybeRefOrGetter<T | undefined>;

  /**
   * Filter graphical objects that can trigger events. If it is empty, all graphical objects will trigger events
   */
  graphic?: MaybeRefOrGetter<any | any[]>;

  /**
   * callback function
   */
  listener?: (params: GraphicEventParams<T>) => void;

  /**
   * Default value of pause
   */
  pause?: boolean;
}

/**
 * Gestures events for Cesium graphics
 */
export function useGraphicEventHandler<T extends GraphicEventType>(
  options: UseGraphicEventHandlerOptions<T>,
): PausableState {
  const { type, graphic, listener, pause = false } = options;
  const pausable = createPausable(pause);
  const isActive = pausable.isActive;

  const graphicRef = computed(() => {
    const value = toValue(graphic);
    return value ? Array.isArray(value) ? value : [value] : undefined;
  });

  /**
   * Determine Whether a Graphic Meets the Criteria
   */
  const graphicPredicate = (params: GraphicEventParams<T>) => {
    if (!graphicRef.value) {
      return true;
    }
    if (!graphicRef.value.length) {
      return false;
    }
    const graphics = resolvePick(params.pick);
    return graphics.some(graphic => graphicRef.value!.includes(graphic)) && listener?.(params);
  };

  const finalListener = (params: any) => {
    graphicPredicate(params) && listener?.(params);
  };

  const drag = computed(() => toValue(type) === 'DRAG' && isActive.value);
  const hover = computed(() => toValue(type) === 'HOVER' && isActive.value);
  const positioned = computed(() => toValue(type) !== 'DRAG' && toValue(type) !== 'HOVER' && isActive.value);

  const dragHandler = useGraphicDragEventHandler({ pause: !drag.value, listener: finalListener });
  const hoverHandler = useGraphicHoverEventHandler({ pause: !hover.value, listener: finalListener });
  const positionedHandler = useGraphicPositionedEventHandler({ type: type as any, pause: !positioned.value, listener: finalListener });

  watchEffect(() => {
    dragHandler.isActive.value = drag.value;
    hoverHandler.isActive.value = hover.value;
    positionedHandler.isActive.value = positioned.value;
  });

  return pausable;
}

/**
 * Parses and returns an array of specific field values extracted from the pick object
 */
function resolvePick(pick: any): any[] {
  const { primitive, id, primitiveCollection, collection } = pick ?? {};
  const entityCollection = id?.entityCollection;
  const dataSource = entityCollection?.owner;
  const ids = Array.isArray(id) ? id : [id]; // // When aggregating entities, ensure id is an array
  return [
    ...ids,
    primitive,
    primitiveCollection,
    collection,
    entityCollection,
    dataSource,
  ].filter(e => !!e);
}
