import type { ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { isObject } from '@cesium-vueuse/shared';
import { KeyboardEventModifier } from 'cesium';
import { shallowReadonly, shallowRef, toRef, toValue, watch } from 'vue';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';

export type ScreenSpaceEventState<T extends ScreenSpaceEventType> = {
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
  [ScreenSpaceEventType.PINCH_START]: ScreenSpaceEventHandler.TwoPointEvent;
  [ScreenSpaceEventType.PINCH_END]: ScreenSpaceEventHandler.TwoPointEvent;
  [ScreenSpaceEventType.PINCH_MOVE]: ScreenSpaceEventHandler.TwoPointMotionEvent;
  [ScreenSpaceEventType.WHEEL]: number;
}[T];

interface UseScreenSpaceEventStateOptions {
  isActive?: MaybeRefOrGetter<boolean | undefined>;
}

/**
 *  Reactive of `Cesium.ScreenSpaceEventHandler` listener's result.
 *  @param type The event type to track.
 */
export function useScreenSpaceEventState<T extends ScreenSpaceEventType>(
  type?: MaybeRefOrGetter<T | undefined>,
  options: UseScreenSpaceEventStateOptions = {},
): Readonly<ShallowRef<ScreenSpaceEventState<T> | undefined>> {
  const { isActive = true } = options;

  const state = shallowRef<ScreenSpaceEventState<T>>();
  watch(toRef(type), () => state.value = undefined);

  const shallowClone = (data: any): ScreenSpaceEventState<T> => {
    if (isObject(data)) {
      return Object.keys(data).reduce((res, key) => {
        res[key] = (data as any)[key]?.clone();
        return res;
      }, {} as any);
    }
    else {
      return data;
    }
  };

  [undefined, ...Object.values(KeyboardEventModifier)]
    .forEach((modifier) => {
      const pausable = useScreenSpaceEventHandler({
        type,
        modifier: modifier as unknown as KeyboardEventModifier | undefined,
        pause: !toValue(isActive),
        inputAction: (event: any) => {
          state.value = shallowClone(event);
        },
      });
      watch(toRef(isActive), isActive => pausable.isActive.value = !!isActive);
    });

  return shallowReadonly(state);
}
