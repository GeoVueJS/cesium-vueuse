import { readonly, ref, toValue, watchEffect } from 'vue';

import type { FunctionArgs, Pausable } from '@vueuse/core';
import type { Event } from 'cesium';
import type { MaybeRefOrGetter } from 'vue';

export interface UseCesiumEventListenerOptions {
  /**
   * 初始化时是否暂停
   */
  pause?: boolean;
}

export function useCesiumEventListener<T extends FunctionArgs<any[]>>(
  event: MaybeRefOrGetter<Event<T> | undefined>,
  listener: T,
  options?: UseCesiumEventListenerOptions,
): Pausable {
  const isActive = ref(!options?.pause);

  watchEffect((onCleanup) => {
    const _event = toValue(event);
    if (_event && isActive.value) {
      const stop = _event.addEventListener(listener, _event);
      onCleanup(() => stop());
    }
  });

  const pause = () => (isActive.value = false);
  const resume = () => (isActive.value = true);

  return {
    isActive: readonly(isActive),
    pause,
    resume,
  };
}
