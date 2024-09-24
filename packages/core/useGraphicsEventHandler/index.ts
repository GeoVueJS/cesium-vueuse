import type { AnyFn, Arrayable, Pausable } from '@vueuse/core';
import type { KeyboardEventModifier } from 'cesium';

import type { MaybeRefOrGetter } from 'vue';

import type { GraphicsEventType, GraphicsHandlerCallback } from '../useGlobleGraphicsEventHandler/types';
import { isFunction } from '@cesium-vueuse/shared';
import { computed, readonly, ref, toValue, watchEffect } from 'vue';
import { useGlobleGraphicsEventHandler } from '../useGlobleGraphicsEventHandler';

export interface GraphicsHandlerCallbackConfig<T extends GraphicsEventType> {
  modifier?: KeyboardEventModifier;
  callback: GraphicsHandlerCallback<T>;
}

export interface GraphicsEventConfig {
  LEFT_DOWN?: GraphicsHandlerCallback<'LEFT_DOWN'> | GraphicsHandlerCallbackConfig<'LEFT_DOWN'>;
  LEFT_UP?: GraphicsHandlerCallback<'LEFT_UP'> | GraphicsHandlerCallbackConfig<'LEFT_UP'>;
  LEFT_CLICK?: GraphicsHandlerCallback<'LEFT_CLICK'> | GraphicsHandlerCallbackConfig<'LEFT_CLICK'>;
  LEFT_DOUBLE_CLICK?: GraphicsHandlerCallback<'LEFT_DOUBLE_CLICK'> | GraphicsHandlerCallbackConfig<'LEFT_DOUBLE_CLICK'>;
  RIGHT_DOWN?: GraphicsHandlerCallback<'RIGHT_DOWN'> | GraphicsHandlerCallbackConfig<'RIGHT_DOWN'>;
  RIGHT_UP?: GraphicsHandlerCallback<'RIGHT_UP'> | GraphicsHandlerCallbackConfig<'RIGHT_UP'>;
  RIGHT_CLICK?: GraphicsHandlerCallback<'RIGHT_CLICK'> | GraphicsHandlerCallbackConfig<'RIGHT_CLICK'>;
  MIDDLE_DOWN?: GraphicsHandlerCallback<'MIDDLE_DOWN'> | GraphicsHandlerCallbackConfig<'MIDDLE_DOWN'>;
  MIDDLE_UP?: GraphicsHandlerCallback<'MIDDLE_UP'> | GraphicsHandlerCallbackConfig<'MIDDLE_UP'>;
  MIDDLE_CLICK?: GraphicsHandlerCallback<'MIDDLE_CLICK'> | GraphicsHandlerCallbackConfig<'MIDDLE_CLICK'>;
  HOVER?: GraphicsHandlerCallback<'HOVER'> | GraphicsHandlerCallbackConfig<'HOVER'>;
  DRAG?: GraphicsHandlerCallback<'DRAG'> | GraphicsHandlerCallbackConfig<'DRAG'>;
}

export function useGraphicsEventHandler<T = any>(
  graphics: MaybeRefOrGetter<Arrayable<T>>,
  config: GraphicsEventConfig,
): Pausable {
  const { add, remove } = useGlobleGraphicsEventHandler();

  const graphicsList = computed(() => {
    const value = toValue(graphics);
    return Array.isArray(value) ? value : [value];
  });

  const isActive = ref(false);

  const callback: GraphicsHandlerCallback<GraphicsEventType> = ({ type, modifier, params }) => {
    if (!isActive.value) {
      return;
    }
    const event = config[type];
    if (!event) {
      return;
    }

    const handler: AnyFn = isFunction(event) ? event : event.callback;
    const eventModifier = isFunction(event) ? undefined : event.modifier;

    if (!handler || `${eventModifier}` !== `${modifier}`) {
      return;
    }

    const picks = Object.values(params.pick) as any[];

    for (const pick of picks) {
      if (graphicsList.value.includes(pick)) {
        handler({ type, modifier, params });
      }
    }
  };

  watchEffect((onCleanup) => {
    add(callback);
    onCleanup(() => remove(callback));
  });

  return {
    isActive: readonly(isActive),
    pause: () => isActive.value = false,
    resume: () => isActive.value = true,
  };
}
