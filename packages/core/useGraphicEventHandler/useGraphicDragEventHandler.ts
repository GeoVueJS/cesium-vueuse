import type { Cartesian2 } from 'cesium';
import type { MaybeRefOrGetter, WatchStopHandle } from 'vue';
import type { GraphicDragEventListener } from './types';
import { tryOnScopeDispose } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { shallowRef, toRef, watch } from 'vue';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';
import { useViewer } from '../useViewer';

export interface UseGraphicDragEventHandlerOptions {

  /**
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
}

/**
 * Use graphic drag events with ease, and remove listener automatically on unmounted.
 * @param listener
 * @param options
 */
export function useGraphicDragEventHandler(
  listener: GraphicDragEventListener,
  options: UseGraphicDragEventHandlerOptions = {},
): WatchStopHandle {
  const isActive = toRef(options.isActive ?? true);
  const viewer = useViewer();
  const draging = shallowRef(false);
  const startPosition = shallowRef<Cartesian2>();
  const endPosition = shallowRef<Cartesian2>();

  watch(isActive, (isActive) => {
    !isActive && (draging.value = false);
  });

  const pick = shallowRef<any>();

  const execute = () => {
    if (startPosition.value && endPosition.value && pick.value) {
      let enableRotate = true;
      const lockCamera = () => {
        enableRotate = false;
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
      if (!draging.value) {
        enableRotate = true;
      }
      viewer.value!.scene.screenSpaceCameraController.enableRotate = enableRotate;
    }
  };

  const cleanup1 = useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_DOWN,
    (context) => {
      startPosition.value = context.position.clone();
      pick.value = viewer.value?.scene.pick(startPosition.value);
      draging.value = true;
    },
    { isActive },
  );

  const cleanup2 = useScreenSpaceEventHandler(
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

  const cleanup3 = useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_UP,
    (context) => {
      endPosition.value = context.position.clone();
      draging.value = false;
      execute();
      pick.value = undefined;
    },
    { isActive },
  );

  const stop = () => {
    cleanup1();
    cleanup2();
    cleanup3();
  };

  tryOnScopeDispose(stop);

  return stop;
}
