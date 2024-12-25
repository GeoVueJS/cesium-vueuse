import type { Arrayable, AsyncComputedOnCancel, AsyncComputedOptions, FunctionArgs } from '@vueuse/core';
import type { Event } from 'cesium';
import type { MaybeRefOrGetter, Ref } from 'vue';
import type { UseCesiumEventListenerOptions } from '../useCesiumEventListener';
import { computedAsync } from '@vueuse/core';
import { shallowRef } from 'vue';
import { useCesiumEventListener } from '../useCesiumEventListener';

export interface UseCesiumEventComputedOptions extends UseCesiumEventListenerOptions, AsyncComputedOptions {

}

export function useCesiumEventComputed<T extends FunctionArgs<any[]>, R = any>(
  event: MaybeRefOrGetter<Arrayable<Event<T>> | undefined>,
  evaluationCallback?: (params: any | undefined, onCancel: AsyncComputedOnCancel,) => Promise<R> | R,
  options?: UseCesiumEventComputedOptions,
): Ref<R | undefined> {
  const params = shallowRef();
  useCesiumEventListener<any>(
    event,
    (e: any) => (params.value = e),
    options,
  );
  return computedAsync(onCancel => evaluationCallback?.(params.value, onCancel), undefined, options);
}
