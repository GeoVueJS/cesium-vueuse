import type { Cartesian2, ScreenSpaceEventHandler } from 'cesium';
import type { WatchStopHandle } from 'vue';
import { throttle } from '@cesium-vueuse/shared';
import { tryOnScopeDispose } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { nextTick, ref, shallowRef, watch } from 'vue';
import { useScenePick } from '../useScenePick';
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
  dragging: boolean;

  /**
   * Whether to lock the camera, Will automatically resume when you end dragging.
   */
  lockCamera: () => void;
}

/**
 * Use graphic drag events with ease, and remove listener automatically on unmounted.
 */
export function useDrag(
  allow: (pick: any) => boolean,
  listener: (params: GraphicDragParams) => void,
): WatchStopHandle {
  const position = shallowRef<Cartesian2>();
  const pick = useScenePick(position);
  const motionEvent = shallowRef<ScreenSpaceEventHandler.MotionEvent>();
  const dragging = ref(false);

  const viewer = useViewer();

  const cameraLocked = ref(false);

  watch(cameraLocked, (cameraLocked) => {
    viewer.value && (viewer.value.scene.screenSpaceCameraController.enableRotate = !cameraLocked);
  });

  const lockCamera = () => {
    cameraLocked.value = true;
  };

  const execute = (pick: unknown, startPosition: Cartesian2, endPosition: Cartesian2) => {
    if (!allow(pick)) {
      return;
    }

    listener({
      context: {
        startPosition: startPosition.clone(),
        endPosition: endPosition.clone(),
      },
      pick,
      dragging: dragging.value,
      lockCamera,
    });
    // reset lockCamera
    nextTick(() => {
      if (!dragging.value && cameraLocked.value) {
        cameraLocked.value = false;
      }
    });
  };

  const stopLeftDownWatch = useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_DOWN,
    (context) => {
      dragging.value = true;
      position.value = context.position.clone();
    },
  );

  const stopMouseMoveWatch = useScreenSpaceEventHandler(
    ScreenSpaceEventType.MOUSE_MOVE,
    throttle(({ startPosition, endPosition }) => {
      motionEvent.value = {
        startPosition: motionEvent.value?.endPosition.clone() || startPosition.clone(),
        endPosition: endPosition.clone(),
      };
    }, 16, false, true),
  );

  // dragging
  watch([pick, motionEvent], ([pick, motionEvent]) => {
    if (pick && motionEvent) {
      const { startPosition, endPosition } = motionEvent;
      dragging.value && execute(pick, startPosition, endPosition);
    }
  });

  // drag end
  const stopLeftUpWatch = useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_UP,
    (context) => {
      dragging.value = false;

      if (pick.value && motionEvent.value) {
        execute(pick.value, motionEvent.value.endPosition, context.position);
      }
      position.value = undefined;
      motionEvent.value = undefined;
    },
  );

  const stop = () => {
    stopLeftDownWatch();
    stopMouseMoveWatch();
    stopLeftUpWatch();
  };

  tryOnScopeDispose(stop);

  return stop;
}
