import type { KeyboardEventModifier, ScreenSpaceEventType } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';
import type { PausableState } from '../createPausable';
import { isDef } from '@cesium-vueuse/shared';
import { ScreenSpaceEventHandler } from 'cesium';
import { computed, toValue, watch, watchEffect } from 'vue';
import { createPausable } from '../createPausable';
import { useViewer } from '../useViewer';

export type ScreenSpaceEvent<T extends ScreenSpaceEventType> = {
  [ScreenSpaceEventType.LEFT_DOWN]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.LEFT_UP]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.LEFT_CLICK]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.LEFT_DOUBLE_CLICK]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.RIGHT_DOWN]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.RIGHT_UP]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.RIGHT_CLICK]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.MIDDLE_DOWN]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.MIDDLE_UP]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.MIDDLE_CLICK]: ScreenSpaceEventHandler.PositionedEvent;
  [ScreenSpaceEventType.MOUSE_MOVE]: ScreenSpaceEventHandler.MotionEvent;
  [ScreenSpaceEventType.WHEEL]: number;
  [ScreenSpaceEventType.PINCH_START]: ScreenSpaceEventHandler.TwoPointEvent;
  [ScreenSpaceEventType.PINCH_END]: ScreenSpaceEventHandler.TwoPointEvent;
  [ScreenSpaceEventType.PINCH_MOVE]: ScreenSpaceEventHandler.TwoPointMotionEvent;
}[T];

export interface UseScreenSpaceEventHandlerOptions {
  /**
   * Modifier key
   */
  modifier?: MaybeRefOrGetter<KeyboardEventModifier | undefined>;

  /**
   * Default value of pause
   */
  pause?: boolean;
}

/**
 * Easily use the `ScreenSpaceEventHandler`,
 * when the dependent data changes or the component is unmounted,
 * the listener function will automatically reload or destroy.
 *
 * @param type Types of mouse event
 * @param inputAction Callback function for listening
 */
export function useScreenSpaceEventHandler<T extends ScreenSpaceEventType>(
  type?: MaybeRefOrGetter<T | undefined>,
  inputAction?: (event: ScreenSpaceEvent<T>) => any,
  options: UseScreenSpaceEventHandlerOptions = {},
): PausableState {
  const { pause, modifier } = options;

  const viewer = useViewer();

  const pausable = createPausable(pause);
  const isActive = pausable.isActive;

  const handler = computed(() => {
    if (viewer.value) {
      return new ScreenSpaceEventHandler(viewer.value.canvas);
    }
  });

  watch(handler, (_value, oldValue) => {
    oldValue?.destroy();
  });

  watchEffect((onCleanup) => {
    const typeValue = toValue(type);
    const modifierValue = toValue(modifier);
    const handlerValue = toValue(handler)!;
    if (!handlerValue || !isActive.value || !inputAction) {
      return;
    }
    if (isDef(typeValue)) {
      handlerValue.setInputAction(inputAction as any, typeValue, modifierValue);
      onCleanup(() => handlerValue!.removeInputAction(typeValue, modifierValue));
    }
  });

  return pausable;
}
