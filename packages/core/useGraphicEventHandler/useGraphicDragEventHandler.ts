import type { Cartesian2 } from 'cesium';
import type { PausableState } from '../createPausable';
import type { GraphicDragEventListener } from './types';
import { ScreenSpaceEventType } from 'cesium';
import { shallowRef, watch } from 'vue';
import { createPausable } from '../createPausable';
import { useScenePick } from '../useScenePick';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';

export interface UseGraphicDragEventHandlerOptions {
  listener?: GraphicDragEventListener;
  pause?: boolean;
}

export function useGraphicDragEventHandler(options: UseGraphicDragEventHandlerOptions): PausableState {
  const { listener, pause = false } = options;

  const pausable = createPausable(pause);
  const isActive = pausable.isActive;

  const ended = shallowRef(false);

  const startPosition = shallowRef<Cartesian2>();
  const endPosition = shallowRef<Cartesian2>();

  useScreenSpaceEventHandler(ScreenSpaceEventType.LEFT_DOWN, (context) => {
    startPosition.value = context.position.clone();
    ended.value = false;
  });

  useScreenSpaceEventHandler(ScreenSpaceEventType.MOUSE_MOVE, (context) => {
    endPosition.value = context.endPosition.clone();
  });

  useScreenSpaceEventHandler(ScreenSpaceEventType.LEFT_UP, () => {
    ended.value = true;
  });

  const pick = useScenePick(() => startPosition.value, { isActive });

  const dragCallback = (draging: boolean) => {
    if (startPosition.value && endPosition.value && pick.value) {
      listener?.({
        context: {
          startPosition: startPosition.value,
          endPosition: endPosition.value,
        },
        pick: pick.value,
        draging,
      });
    }
  };

  watch([startPosition, endPosition], () => {
    !ended.value && dragCallback(true);
  });
  watch(ended, () => {
    ended.value && dragCallback(false);
  });

  return pausable;
}
