import type { Nullable } from '@cesium-vueuse/shared';
import type { Arrayable } from '@vueuse/core';
import type { Cartesian2, ScreenSpaceEventHandler } from 'cesium';
import type { CSSProperties, MaybeRef, MaybeRefOrGetter, WatchStopHandle } from 'vue';
import { pickHitGraphic } from '@cesium-vueuse/shared';
import { tryOnScopeDispose } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { computed, ref, shallowRef, toRef, toValue, watch } from 'vue';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';
import { useViewer } from '../useViewer';

/**
 * Parameters for graphic drag events
 */
export interface GraphicDragParams {
  /**
   * Context of the motion event
   */
  context: ScreenSpaceEventHandler.MotionEvent;

  /**
   * The graphic object picked by `scene.pick`
   */
  pick: any;

  /**
   * Whether the graphic is currently being dragged. Returns `true` continuously while dragging, and `false` once it ends.
   */
  draging: boolean;

  /**
   * Whether to lock the camera, Will automatically resume when you end dragging.
   */
  lockCamera: () => void;
}

export interface UseDragOptions {
  /**
   * Event listener.
   */
  listener: (params: GraphicDragParams) => void;

  /**
   * Graphic to be listened, the event will be triggered on all graphics when if null.
   */
  graphic?: MaybeRefOrGetter<Arrayable<any>>;

  /**
   * Predicate function to determine whether the event is allowed.
   */
  predicate?: (pick: any) => boolean;

  /**
   *  Cursor style when dragging.
   */
  cursor?: MaybeRef<Nullable<CSSProperties['cursor']>> | ((pick: any) => Nullable<CSSProperties['cursor']>);

  /**
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
}

/**
 * Use graphic drag events with ease, and remove listener automatically on unmounted.
 * @param options
 */
export function useDrag(
  options: UseDragOptions,
): WatchStopHandle {
  const { listener, predicate, graphic, cursor } = options;
  const isActive = toRef(options.isActive ?? true);

  const graphicList = computed(() => {
    const value = toValue(graphic);
    return value ? Array.isArray(value) ? value : [value] : undefined;
  });

  const viewer = useViewer();
  const draging = ref(false);
  const startPosition = shallowRef<Cartesian2>();
  const endPosition = shallowRef<Cartesian2>();
  const pick = shallowRef<any>();

  watch(isActive, (isActive) => {
    !isActive && (draging.value = false);
  });

  const isEventAllowed = (pick: any) => {
    let allow = predicate?.(pick) ?? true;
    if (graphicList.value && !pickHitGraphic(pick, graphicList)) {
      allow = false;
    }
    return allow;
  };

  const execute = () => {
    if (startPosition.value && endPosition.value && pick.value && isEventAllowed(pick.value)) {
      const lockCamera = () => {
      };
      listener({
        context: {
          startPosition: startPosition.value.clone(),
          endPosition: endPosition.value.clone(),
        },
        pick: pick.value,
        draging: draging.value,
        lockCamera,
      });
    }
  };

  const stopLeftDownWatch = useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_DOWN,
    (context) => {
      const coordinate = context.position;
      const obj = pick.value = viewer.value?.scene.pick(coordinate);
      if (obj) {
        draging.value = true;
        pick.value = obj;
      }
    },
    { isActive },
  );

  const stopMouseMoveWatch = useScreenSpaceEventHandler(
    ScreenSpaceEventType.MOUSE_MOVE,
    (context) => {
      if (draging.value && pick.value) {
        startPosition.value = context.startPosition.clone();
        endPosition.value = context.endPosition.clone();
        execute();
      }
    },
    { isActive },
  );

  const stopLeftUpWatch = useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_UP,
    (context) => {
      endPosition.value = context.position.clone();
      draging.value = false;
      execute();
      startPosition.value = undefined;
      endPosition.value = undefined;
      draging.value = false;
      pick.value = undefined;
    },
    { isActive },
  );

  const stop = () => {
    stopLeftDownWatch();
    stopMouseMoveWatch();
    stopLeftUpWatch();
  };

  tryOnScopeDispose(stop);

  return stop;
}
