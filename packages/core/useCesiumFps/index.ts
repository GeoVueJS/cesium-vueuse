import type { Ref } from 'vue';

import { watchThrottled } from '@vueuse/core';
import { computed, readonly, ref, shallowRef } from 'vue';
import { useCesiumEventListener } from '../useCesiumEventListener';
import { useViewer } from '../useViewer';

export interface UseCesiumFpsOptions {
  /**
   * Throttled sampling (ms)
   * @default 8
   */
  delay?: number;
}

export interface UseCesiumFpsRetrun {
  /**
   * Inter-frame Interval (ms)
   */
  interval: Readonly<Ref<number>>;

  /**
   * Frames Per Second
   */
  fps: Readonly<Ref<number>>;
}

/**
 * Reactive get the frame rate of Cesium
 */
export function useCesiumFps(options: UseCesiumFpsOptions = {}): UseCesiumFpsRetrun {
  const { delay = 8 } = options;

  const viewer = useViewer();
  const p = shallowRef(performance.now());

  useCesiumEventListener(
    () => viewer.value?.scene.postRender,
    () => p.value = performance.now(),
  );

  const interval = ref(0);

  watchThrottled(p, (value, oldValue) => {
    interval.value = value - oldValue;
  }, {
    throttle: delay,
  });

  const fps = computed(() => {
    return 1000 / interval.value;
  });

  return {
    interval: readonly(interval),
    fps,
  };
}
