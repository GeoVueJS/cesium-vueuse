import type { Nullable } from '@vesium/shared';
import type { Arrayable } from '@vueuse/core';
import type { CSSProperties, MaybeRef, MaybeRefOrGetter, WatchStopHandle } from 'vue';
import type { GraphicDragParams } from './useDrag';
import type { GraphicHoverParams } from './useHover';
import type { GraphicTapParams } from './useTap';
import { isFunction, pickHitGraphic } from '@vesium/shared';
import { computed, ref, shallowRef, toValue, watch } from 'vue';
import { useViewer } from '../useViewer';
import { useDrag } from './useDrag';
import { useHover } from './useHover';
import { useTap } from './useTap';

export interface UseGraphicGestureOptions {

  /**
   * Graphic to be listened, the event will be triggered on all graphics when if null.
   */
  graphic?: MaybeRefOrGetter<Arrayable<any>>;

  /**
   * Predicate function to determine whether the event is allowed.
   */
  predicate?: (pick: any) => boolean;

  /**
   *  Cursor style when hovering.
   */
  cursor?: MaybeRef<Nullable<CSSProperties['cursor']>> | ((pick: any) => Nullable<CSSProperties['cursor']>);

  /**
   *  Cursor style when dragging.
   */
  dragCursor?: MaybeRef<Nullable<CSSProperties['cursor']>> | ((pick: any) => Nullable<CSSProperties['cursor']>);

  /**
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
}

export type TapType = 'LEFT_DOWN' | 'LEFT_UP' | 'LEFT_CLICK' | 'LEFT_DOUBLE_CLICK' | 'RIGHT_DOWN' | 'RIGHT_UP' | 'RIGHT_CLICK' | 'MIDDLE_DOWN' | 'MIDDLE_UP' | 'MIDDLE_CLICK';

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 * overLoaded1 TAP
 */
export function useGraphicGesture(
  type: TapType,
  options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }
): WatchStopHandle;

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 * overLoaded2 HOVER
 */
export function useGraphicGesture(
  type: 'HOVER',
  options: UseGraphicGestureOptions & { listener: (params: GraphicHoverParams) => void }
): WatchStopHandle;

/**
 *
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 * overLoaded3 DRAG
 */
export function useGraphicGesture(
  type: 'DRAG',
  options: UseGraphicGestureOptions & { listener: (params: GraphicDragParams) => void }
): WatchStopHandle;

export function useGraphicGesture(type: TapType | 'HOVER' | 'DRAG', options: UseGraphicGestureOptions & { listener: (params: any) => void }): WatchStopHandle {
  const { graphic, predicate, cursor, dragCursor, isActive = true, listener } = options;

  const graphicList = computed(() => {
    const value = toValue(graphic);
    return value ? Array.isArray(value) ? value : [value] : undefined;
  });

  // Predicate function to determine whether the event is allowed.
  const isEventAllowed = (pick: any) => {
    if (!toValue(isActive)) {
      return false;
    }
    let allow = predicate?.(pick) ?? true;
    if (graphicList.value && !pickHitGraphic(pick, graphicList.value)) {
      allow = false;
    }
    return allow;
  };

  const viewer = useViewer();

  const hovering = ref(false);
  const dragging = ref(false);
  const pick = shallowRef<any>();

  // Update cursor style
  watch([hovering, dragging, pick], ([hovering, dragging, pick]) => {
    if (pick) {
      const hoverCss = isFunction(cursor) ? cursor(pick) : toValue(cursor);
      const dragCss = isFunction(dragCursor) ? dragCursor(pick) : toValue(dragCursor);
      const style = viewer.value!.container.parentElement!.style;
      if (dragging && dragCss) {
        style.setProperty('cursor', dragCss);
      }
      else if (hovering && hoverCss) {
        style.setProperty('cursor', hoverCss);
      }
      else if (hoverCss || dragCss) {
        style.removeProperty('cursor');
      }
    }
  });

  // HOVER
  const stopHoverWatch = useHover(isEventAllowed, (params) => {
    hovering.value = params.hovering;
    if (!dragging.value) {
      pick.value = params.pick;
    }
    type === 'HOVER' && listener(params);
  });

  // DRAG
  const stopDragWatch = useDrag(isEventAllowed, (params) => {
    dragging.value = params.dragging;
    pick.value = params.pick;
    type === 'DRAG' && listener(params);
  });

  let stopTapWatch: WatchStopHandle;

  // TAP
  if (type !== 'DRAG' && type !== 'HOVER') {
    stopTapWatch = useTap(type, isEventAllowed, listener);
  }

  const stop = () => {
    stopHoverWatch();
    stopDragWatch();
    stopTapWatch?.();
  };
  return stop;
}
/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `LEFT_CLICK`
 */
export const useGraphicLeftClick = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('LEFT_CLICK', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `LEFT_DOUBLE_CLICK`
 */
export const useGraphicLeftDoubleClick = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('LEFT_DOUBLE_CLICK', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `LEFT_DOWN`
 */
export const useGraphicLeftDown = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('LEFT_DOWN', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `LEFT_UP`
 */
export const useGraphicLeftUp = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('LEFT_UP', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `RIGHT_CLICK`
 */
export const useGraphicRightClick = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('RIGHT_CLICK', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `RIGHT_DOWN`
 */
export const useGraphicRightDown = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('RIGHT_DOWN', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `RIGHT_UP`
 */
export const useGraphicRightUp = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('RIGHT_UP', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `MIDDLE_CLICK`
 */
export const useGraphicMiddleClick = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('MIDDLE_CLICK', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `MIDDLE_DOWN`
 */
export const useGraphicMiddleDown = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('MIDDLE_DOWN', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `MIDDLE_UP`
 */
export const useGraphicMiddleUp = (options: UseGraphicGestureOptions & { listener: (params: GraphicTapParams) => void }) => useGraphicGesture('MIDDLE_UP', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `HOVER`
 */
export const useGraphicHover = (options: UseGraphicGestureOptions & { listener: (params: GraphicHoverParams) => void }) => useGraphicGesture('HOVER', options);

/**
 * Bind graphical gesture events quickly, and the listener function will automatically destroy.
 *
 * Alias of useGraphicGesture `DRAG`
 */
export const useGraphicDrag = (options: UseGraphicGestureOptions & { listener: (params: GraphicDragParams) => void }) => useGraphicGesture('DRAG', options);
