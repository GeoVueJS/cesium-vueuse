import { Cartographic } from 'cesium';
import { readonly, shallowRef, watchEffect } from 'vue';

import { useCesiumEventListener } from '../useCesiumEventListener';
import { useViewer } from '../useViewer';

export interface UseCameraLevelOptions {
}

export interface UseCameraLevelRetrun {
}

export function useCameraLevel(options?: UseCameraLevelOptions): UseCameraLevelRetrun | undefined {
  const viewer = useViewer();
  const cartographic = shallowRef<Cartographic>();
  const setCartographic = () => {
    const position = viewer.value?.camera.position;
    if (position) {
      cartographic.value = Cartographic.fromCartesian(position);
    }
  };

  watchEffect(setCartographic);
  useCesiumEventListener(() => viewer.value?.camera.changed, setCartographic);

  const zoom = () => {
    /* 根据camera高度近似计算当前层级 */
    const A = 40487.57;
    const B = 0.00007096758;
    const C = 91610.74;
    const D = -40467.74;
    return D + (A - D) / (1 + (cartographic.value!.height! / C) ** B);
  };

  return {
    cartographic: readonly(cartographic),
  };
}
