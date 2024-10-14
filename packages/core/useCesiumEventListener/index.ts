import type { FunctionArgs } from '@vueuse/core';
import type { Event } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';
import type { PausableState } from '../createPausable';
import { toValue, watchEffect } from 'vue';
import { createPausable } from '../createPausable';

export interface UseCesiumEventListenerOptions {
  /**
   * Default value of pause
   */
  pause?: boolean;
}

/**
 * Easily use the `addEventListener` in `Cesium.Event` instances,
 * when the dependent data changes or the component is unmounted,
 * the listener function will automatically reload or destroy.
 */
export function useCesiumEventListener<T extends FunctionArgs<any[]>>(
  event: MaybeRefOrGetter<Event<T> | undefined>,
  listener: T,
  options?: UseCesiumEventListenerOptions,
): PausableState {
  const pausable = createPausable(options?.pause);

  watchEffect((onCleanup) => {
    const _event = toValue(event);
    if (_event && pausable.isActive.value) {
      const stop = _event.addEventListener(listener, _event);
      onCleanup(() => stop());
    }
  });

  return pausable;
}
