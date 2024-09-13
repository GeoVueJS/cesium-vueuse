import { computed, readonly, ref, shallowRef, watch } from 'vue';

import type { Ref } from 'vue';
import { useCesiumEventListener } from '../useCesiumEventListener';
import { useViewer } from '../useViewer';

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
export function useCesiumFps(): UseCesiumFpsRetrun {
  const viewer = useViewer();
  const p = shallowRef(performance.now());

  useCesiumEventListener(
    () => viewer.value?.scene.postRender,
    () => p.value = performance.now(),
  );

  const interval = ref(0);

  watch(p, (value, oldValue) => {
    interval.value = value - oldValue;
  });
  const fps = computed(() => {
    return Number.parseFloat((1000 / interval.value).toFixed(1));
  });

  return {
    interval: readonly(interval),
    fps,
  };
}
