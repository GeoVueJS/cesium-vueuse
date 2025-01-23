import type { Arrayable } from '@vueuse/core';
import type { CSSProperties, MaybeRefOrGetter, WatchStopHandle } from 'vue';
import type { GraphicDragEventParams, GraphicHoverEventParams, GraphicPositionedEventParams } from './types';
import type { GraphicPositiondEventType } from './useTap';
import { isFunction, pickHitGraphic } from '@cesium-vueuse/shared';
import { tryOnScopeDispose } from '@vueuse/core';
import { ref, toRef, toValue, watchEffect } from 'vue';
import { useViewer } from '../useViewer';
import { useDrag } from './useDrag';
import { useGraphicHoverEventHandler } from './useHover';
import { useGraphicPositionedEventHandler } from './useTap';

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
  type: T;

  /**
   * Filter graphical objects that can trigger events. If it is empty, all graphical objects will trigger events
   */
  graphic?: MaybeRefOrGetter<Arrayable<any>>;

  /**
   * callback function
   */
  listener: (params: GraphicEventParams<T>) => void;

  /**
   * Mouse cursor style when hover or drag over the graphic.
   */
  cursor?: CSSProperties['cursor'] | ((type: 'hover' | 'drag') => CSSProperties['cursor'] | undefined);

  /**
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
}

/**
 * Gestures events for Cesium graphics
 */
export function useGraphicEventHandler<T extends GraphicEventType>(
  options: UseGraphicEventHandlerOptions<T>,
): WatchStopHandle {
  const { type, graphic, listener, cursor } = options;
  const isActive = toRef(options.isActive ?? true);

  /**
   * Determine Whether a Graphic Meets the Criteria
   */
  const predicate = (params: any): boolean => {
    let allowed = true;
    if (graphic) {
      const maybeArray = toValue(graphic);
      const graphics = maybeArray && Array.isArray(maybeArray) ? maybeArray : [maybeArray];
      allowed = pickHitGraphic(params.pick, graphics);
    }
    return allowed;
  };

  const finalListener = (params: any) => {
    predicate(params) && listener?.(params);
  };

  const stopPositionedWatch = useGraphicPositionedEventHandler(
    type as GraphicPositiondEventType,
    finalListener,
    {
      isActive: () => type !== 'DRAG' && type !== 'HOVER' && isActive.value,
    },
  );

  const dragging = ref(false);
  const hovering = ref(false);

  const stopDragWatch = useDrag((params) => {
    if (predicate(params)) {
      type === 'DRAG' && listener(params as any);
      dragging.value = params.draging;
    }
  }, { isActive });

  const stopHoverWatch = useGraphicHoverEventHandler((params) => {
    if (predicate(params)) {
      type === 'HOVER' && listener(params as any);
      hovering.value = params.hover;
    }
  }, { isActive });

  const viewer = useViewer();

  watchEffect(() => {
    const canvas = viewer.value?.cesiumWidget.canvas;
    if (canvas) {
      if (dragging.value) {
        canvas.parentElement!.style.cursor = isFunction(cursor) ? cursor?.('drag') ?? '' : cursor ?? '';
      }
      else if (hovering.value) {
        canvas.parentElement!.style.cursor = isFunction(cursor) ? cursor?.('hover') ?? '' : cursor ?? '';
      }
      else {
        canvas.parentElement!.style.cursor = '';
      }
    }
  });

  const stop = () => {
    stopDragWatch();
    stopHoverWatch();
    stopPositionedWatch();
  };

  tryOnScopeDispose(stop);

  return stop;
}
