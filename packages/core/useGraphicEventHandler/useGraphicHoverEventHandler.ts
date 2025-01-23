import type { ScreenSpaceEventHandler } from 'cesium';
import type { MaybeRefOrGetter, WatchStopHandle } from 'vue';
import type { GraphicHoverEventListener } from './types';
import { tryOnScopeDispose, usePrevious } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { shallowRef, toRaw, toRef, watch } from 'vue';
import { useScenePick } from '../useScenePick';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';

export interface UseGraphicHoverEventHandlerOptions {

  /**
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
}

export function useGraphicHoverEventHandler(
  listener: GraphicHoverEventListener,
  options: UseGraphicHoverEventHandlerOptions,
): WatchStopHandle {
  const isActive = toRef(options.isActive ?? true);
  const context = shallowRef<ScreenSpaceEventHandler.MotionEvent>();

  const cleanup = useScreenSpaceEventHandler(ScreenSpaceEventType.MOUSE_MOVE, (event) => {
    context.value = {
      startPosition: event.startPosition.clone(),
      endPosition: event.endPosition.clone(),
    };
  }, {
    isActive,
  });

  const pick = useScenePick(() => context.value?.endPosition, { isActive });
  const prevPick = usePrevious(pick);

  const stopWatch1 = watch(
    [context, pick],
    ([context, pick]) => {
      pick && context && listener?.({
        context,
        pick,
        hover: true,
      });
    },
  );

  const stopWatch2 = watch(prevPick, (prevPick) => {
    prevPick && context.value && listener({
      context: context.value,
      pick: toRaw(prevPick),
      hover: false,
    });
  });

  const stop = () => {
    cleanup();
    stopWatch1();
    stopWatch2();
  };

  tryOnScopeDispose(stop);

  return stop;
}
