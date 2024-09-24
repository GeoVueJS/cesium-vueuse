import type { Pausable } from '@vueuse/core';
import type { KeyboardEventModifier } from 'cesium';

import type { MaybeRefOrGetter } from 'vue';

import { ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import { computed, readonly, ref, toValue, watch, watchEffect } from 'vue';
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
   * @default `ScreenSpaceEventType.LEFT_CLICK`
   */
  type?: MaybeRefOrGetter<T>;

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
export function useScreenSpaceEventHandler<T extends ScreenSpaceEventType = ScreenSpaceEventType.LEFT_CLICK>(
  options: UseScreenSpaceEventHandlerOptions<T> = {},
): Pausable {
  const {
    pause,
    modifier,
    inputAction,
  } = options;
  const viewer = useViewer();
  const isActive = ref(!pause);

  const handler = computed(() => {
    if (viewer.value) {
      return new ScreenSpaceEventHandler(viewer.value.canvas);
    }
  });

  watch(handler, (_value, oldValue) => {
    oldValue?.destroy();
  });

  watchEffect((onCleanup) => {
    if (!handler.value || !isActive.value || !inputAction) {
      return;
    }
    const type = toValue(options.type) ?? ScreenSpaceEventType.LEFT_CLICK;
    const _modifier = toValue(modifier);
    const _handler = toValue(handler)!;
    _handler.setInputAction(inputAction, type, _modifier);
    onCleanup(() => _handler!.removeInputAction(type, _modifier));
  });

  return {
    isActive: readonly(isActive),
    pause: () => isActive.value = false,
    resume: () => isActive.value = true,
  };
}
