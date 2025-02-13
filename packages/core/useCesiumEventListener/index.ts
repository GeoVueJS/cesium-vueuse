import type { Arrayable, FunctionArgs } from '@vueuse/core';
import type { Event } from 'cesium';
import type { MaybeRefOrGetter, WatchStopHandle } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';
import { toRef, toValue, watchEffect } from 'vue';

export interface UseCesiumEventListenerOptions {
  /**
   * Whether to active the event listener.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean>;
}

/**
 * Easily use the `addEventListener` in `Cesium.Event` instances,
 * when the dependent data changes or the component is unmounted,
 * the listener function will automatically reload or destroy.
 */
export function useCesiumEventListener<FN extends FunctionArgs<any[]>>(
  event: Arrayable<Event<FN> | undefined> | Arrayable<MaybeRefOrGetter<Event<FN> | undefined>> | MaybeRefOrGetter<Arrayable<Event<FN> | undefined>>,
  listener: FN,
  options: UseCesiumEventListenerOptions = {},
): WatchStopHandle {
  const isActive = toRef(options.isActive ?? true);

  const cleanup = watchEffect((onCleanup) => {
    const _event = toValue(event);
    const events = Array.isArray(_event) ? _event : [_event];
    if (events) {
      if (events.length && isActive.value) {
        const stopFns = events.map((event) => {
          const e = toValue(event);
          return e?.addEventListener(listener, e);
        });
        onCleanup(() => stopFns.forEach(stop => stop?.()));
      }
    }
  });

  tryOnScopeDispose(cleanup.stop);
  return cleanup.stop;
}
