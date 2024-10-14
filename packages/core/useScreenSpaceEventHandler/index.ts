import type { KeyboardEventModifier, ScreenSpaceEventType } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';
import type { PausableState } from '../createPausable';
import { isDef } from '@cesium-vueuse/shared';
import { ScreenSpaceEventHandler } from 'cesium';
import { computed, toValue, watch, watchEffect } from 'vue';
import { createPausable } from '../createPausable';
import { useViewer } from '../useViewer';

export type InputAction<T extends ScreenSpaceEventType> = {
  [ScreenSpaceEventType.LEFT_DOWN]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.LEFT_UP]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.LEFT_CLICK]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.LEFT_DOUBLE_CLICK]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.RIGHT_DOWN]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.RIGHT_UP]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.RIGHT_CLICK]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.MIDDLE_DOWN]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.MIDDLE_UP]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.MIDDLE_CLICK]: ScreenSpaceEventHandler.PositionedEventCallback;
  [ScreenSpaceEventType.MOUSE_MOVE]: ScreenSpaceEventHandler.MotionEventCallback;
  [ScreenSpaceEventType.WHEEL]: ScreenSpaceEventHandler.WheelEventCallback;
  [ScreenSpaceEventType.PINCH_START]: ScreenSpaceEventHandler.TwoPointEventCallback;
  [ScreenSpaceEventType.PINCH_END]: ScreenSpaceEventHandler.TwoPointEventCallback;
  [ScreenSpaceEventType.PINCH_MOVE]: ScreenSpaceEventHandler.TwoPointMotionEventCallback;
}[T];

export interface UseScreenSpaceEventHandlerOptions<T extends ScreenSpaceEventType> {
  /**
   * Types of mouse event
   */
  type?: MaybeRefOrGetter<T | undefined>;

  /**
   * Callback function for listening
   */
  inputAction?: InputAction<T>;

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
 */
export function useScreenSpaceEventHandler<T extends ScreenSpaceEventType>(
  options: UseScreenSpaceEventHandlerOptions<T> = {},
): PausableState {
  const {
    type,
    pause,
    modifier,
    inputAction,
  } = options;

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
      handlerValue.setInputAction(inputAction, typeValue, modifierValue);
      onCleanup(() => handlerValue!.removeInputAction(typeValue, modifierValue));
    }
  });

  return pausable;
}
