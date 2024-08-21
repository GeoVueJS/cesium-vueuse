import { ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import { computed, readonly, ref, toValue, watchEffect } from 'vue';

import { useViewer } from '../useViewer';

import type { Pausable } from '@vueuse/core';
import type { KeyboardEventModifier } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';

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
   * 事件类型
   * @defaultValue `ScreenSpaceEventType.LEFT_CLICK`
   */
  type?: MaybeRefOrGetter<T>;

  /**
   * 监听事件
   */
  inputAction?: InputAction<T>;

  /**
   * 修饰键
   */
  modifier?: MaybeRefOrGetter<KeyboardEventModifier | undefined>;

  /**
   * 初始化时是否暂停
   */
  pause?: boolean;
}

export function useScreenSpaceEventHandler<T extends ScreenSpaceEventType = ScreenSpaceEventType.LEFT_CLICK>(
  options: UseScreenSpaceEventHandlerOptions<T> = {},
): Pausable {
  const {
    pause,
    modifier,
  } = options;
  const viewer = useViewer();
  const isActive = ref(!pause);

  const handler = computed<ScreenSpaceEventHandler>((oldValue) => {
    oldValue?.destroy();
    return new ScreenSpaceEventHandler(viewer.value.canvas);
  });

  watchEffect((cleanup) => {
    const type = toValue(options.type) ?? ScreenSpaceEventType.LEFT_CLICK;
    const inputAction = options.inputAction;
    const _modifier = toValue(modifier);
    if (isActive.value && inputAction) {
      handler.value.setInputAction(inputAction, type, _modifier);
      cleanup(() => handler.value.removeInputAction(type, _modifier));
    }
  });

  return {
    isActive: readonly(isActive),
    pause: () => isActive.value = false,
    resume: () => isActive.value = true,
  };
}
