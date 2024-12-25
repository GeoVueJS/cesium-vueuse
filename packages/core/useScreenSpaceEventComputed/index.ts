import type { AsyncComputedOnCancel, AsyncComputedOptions } from '@vueuse/core';
import type { KeyboardEventModifier, ScreenSpaceEventType } from 'cesium';
import type { MaybeRefOrGetter, Ref } from 'vue';
import type { ScreenSpaceEvent } from '../useScreenSpaceEventHandler';
import { computedAsync } from '@vueuse/core';
import { shallowRef } from 'vue';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';

export interface UseScreenSpaceEventComputedOptions extends AsyncComputedOptions {
  /**
   * Modifier key
   */
  modifier?: MaybeRefOrGetter<KeyboardEventModifier | undefined>;
}

export function useScreenSpaceEventComputed<T extends ScreenSpaceEventType, R = any>(
  type?: MaybeRefOrGetter<T | undefined>,
  evaluationCallback?: (event: ScreenSpaceEvent<T> | undefined, onCancel: AsyncComputedOnCancel,) => Promise<R> | R,
  options?: UseScreenSpaceEventComputedOptions,
): Ref<R | undefined> {
  const event = shallowRef<ScreenSpaceEvent<T>>();
  useScreenSpaceEventHandler(type, e => (event.value = e), options);
  return computedAsync(onCancel => evaluationCallback?.(event.value, onCancel), undefined, options);
}
