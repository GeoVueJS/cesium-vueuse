import { computed, readonly, ref, shallowRef, watch } from 'vue';

import type { Ref } from 'vue';
import { useCesiumEventListener } from '../useCesiumEventListener';
import { useViewer } from '../useViewer';

export interface UseCesiumFpsRetrun {
  interval: Readonly<Ref<number>>;
  fps: Readonly<Ref<number>>;
}

export function useCesiumFps(): UseCesiumFpsRetrun {
  const viewer = useViewer();
  const currentTime = shallowRef<number>(Date.now());

  useCesiumEventListener(
    () => viewer.value?.scene.postRender,
    () => currentTime.value = Date.now(),
  );

  const interval = ref(0);

  watch(currentTime, (value, oldValue) => {
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
