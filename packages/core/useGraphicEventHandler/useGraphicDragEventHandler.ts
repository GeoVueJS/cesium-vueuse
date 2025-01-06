import type { PausableState } from '../createPausable';
import type { GraphicDragEventListener } from './types';
import { ScreenSpaceEventType } from 'cesium';
import { shallowRef, watch } from 'vue';
import { createPausable } from '../createPausable';
import { useScenePick } from '../useScenePick';
import { useScreenSpaceEventState } from '../useScreenSpaceEventState';

export interface UseGraphicDragEventHandlerOptions {
  listener?: GraphicDragEventListener;
  pause?: boolean;
}

export function useGraphicDragEventHandler(options: UseGraphicDragEventHandlerOptions): PausableState {
  const { listener, pause = false } = options;

  const pausable = createPausable(pause);
  const isActive = pausable.isActive;

  const LEFT_DOWN = useScreenSpaceEventState(ScreenSpaceEventType.LEFT_DOWN, { isActive });
  const MOUSE_MOVE = useScreenSpaceEventState(ScreenSpaceEventType.MOUSE_MOVE, { isActive });
  const LEFT_UP = useScreenSpaceEventState(ScreenSpaceEventType.LEFT_UP, { isActive });

  const pick = useScenePick(() => LEFT_DOWN.value?.position, { isActive });

  const ended = shallowRef(false);
  watch(LEFT_DOWN, () => ended.value = false);
  watch(LEFT_UP, () => ended.value = true);

  const dragingCall = () => {
    if (MOUSE_MOVE.value?.endPosition && pick.value && !ended.value && LEFT_DOWN.value?.position) {
      listener?.({
        context: {
          startPosition: LEFT_DOWN.value.position,
          endPosition: MOUSE_MOVE.value.endPosition,
        },
        pick: pick.value,
        draging: true,
      });
    }
  };

  const endingCall = () => {
    if (ended.value && pick.value && LEFT_DOWN.value?.position && MOUSE_MOVE.value?.endPosition) {
      listener?.({
        context: {
          startPosition: LEFT_DOWN.value.position,
          endPosition: MOUSE_MOVE.value.endPosition,
        },
        pick: pick.value,
        draging: false,
      });
    }
  };

  watch([LEFT_DOWN, MOUSE_MOVE], () => dragingCall());

  watch(ended, () => endingCall());

  return pausable;
}
