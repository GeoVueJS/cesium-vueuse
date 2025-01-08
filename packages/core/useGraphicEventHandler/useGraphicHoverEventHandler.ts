import type { ScreenSpaceEventHandler } from 'cesium';
import type { PausableState } from '../createPausable';
import type { GraphicHoverEventListener } from './types';
import { usePrevious } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { shallowRef, toRaw, watch } from 'vue';
import { createPausable } from '../createPausable';
import { useScenePick } from '../useScenePick';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';

export interface UseGraphicHoverEventHandlerOptions {
  listener?: GraphicHoverEventListener;
  pause?: boolean;
}

export function useGraphicHoverEventHandler(options: UseGraphicHoverEventHandlerOptions): PausableState {
  const { listener, pause } = options;
  const pausable = createPausable(pause);
  const isActive = pausable.isActive;

  const context = shallowRef<ScreenSpaceEventHandler.MotionEvent>();

  useScreenSpaceEventHandler(ScreenSpaceEventType.MOUSE_MOVE, (event) => {
    context.value = {
      startPosition: event.startPosition.clone(),
      endPosition: event.endPosition.clone(),
    };
  });

  const pick = useScenePick(() => context.value?.endPosition, { isActive });
  const prevPick = usePrevious(pick);

  watch([context, pick], ([context, pick]) => {
    pick && context && listener?.({
      context,
      pick,
      hover: true,
    });
  });

  watch(prevPick, (prevPick) => {
    prevPick && context.value && listener?.({
      context: context.value,
      pick: toRaw(prevPick),
      hover: false,
    });
  });

  return pausable;
}
