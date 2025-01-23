import type { Nullable } from '@cesium-vueuse/shared';
import type { Arrayable } from '@vueuse/core';
import type { ScreenSpaceEventHandler } from 'cesium';
import type { CSSProperties, MaybeRef, MaybeRefOrGetter, WatchStopHandle } from 'vue';
import { pickHitGraphic } from '@cesium-vueuse/shared';
import { tryOnScopeDispose, usePrevious } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { computed, ref, shallowRef, toRaw, toRef, toValue, watch } from 'vue';
import { useScenePick } from '../useScenePick';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';

/**
 * Parameters for graphic hover events
 */
export interface GraphicHoverParams {
  /**
   * Context of the motion event
   */
  context: ScreenSpaceEventHandler.MotionEvent;

  /**
   * The graphic object picked by `scene.pick`
   */
  pick: any;

  /**
   * Whether the graphic is currently being hoverged. Returns `true` continuously while hoverging, and `false` once it ends.
   */
  hovering: boolean;

}

export interface UseHoverOptions {
  /**
   * Event listener.
   */
  listener: (params: GraphicHoverParams) => void;

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
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
}

/**
 * Use graphic hover events with ease, and remove listener automatically on unmounted.
 * @param options
 */
export function useHover(
  options: UseHoverOptions,
): WatchStopHandle {
  const { listener, predicate, graphic, cursor } = options;
  const isActive = toRef(options.isActive ?? true);

  const graphicList = computed(() => {
    const value = toValue(graphic);
    return value ? Array.isArray(value) ? value : [value] : undefined;
  });

  const hovering = ref(false);

  watch(isActive, (isActive) => {
    !isActive && (hovering.value = false);
  });

  const isEventAllowed = (pick: any) => {
    let allow = predicate?.(pick) ?? true;
    if (graphicList.value && !pickHitGraphic(pick, graphicList)) {
      allow = false;
    }
    return allow;
  };

  const context = shallowRef<ScreenSpaceEventHandler.MotionEvent>();

  const stopMouseMoveWatch = useScreenSpaceEventHandler(
    ScreenSpaceEventType.MOUSE_MOVE,
    (event) => {
      context.value = {
        startPosition: event.startPosition.clone(),
        endPosition: event.endPosition.clone(),
      };
    },
    {
      isActive,
    },
  );

  const pick = useScenePick(() => context.value?.endPosition, { isActive });

  const allowedPick = computed(() => isEventAllowed(toValue(pick.value)) ? pick.value : undefined);

  const prevAllowedPick = usePrevious(pick);

  const stopHoveringWatch = watch([context, allowedPick], ([context, pick]) => {
    pick && context && isEventAllowed(pick) && listener?.({
      context,
      pick,
      hovering: true,
    });
  });

  const stopEndHoverWatch = watch(prevAllowedPick, (prevPick) => {
    prevPick && context.value && listener({
      context: context.value,
      pick: toRaw(prevPick),
      hovering: false,
    });
  });

  const stop = () => {
    stopMouseMoveWatch();
    stopHoveringWatch();
    stopEndHoverWatch();
  };

  tryOnScopeDispose(stop);

  return stop;
}
