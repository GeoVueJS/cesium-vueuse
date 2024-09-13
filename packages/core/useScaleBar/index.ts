import { throttle } from '@cesium-vueuse/shared';
import { useElementSize } from '@vueuse/core';
import { Cartesian2, EllipsoidGeodesic } from 'cesium';
import { computed, readonly, ref, toValue } from 'vue';

import type { MaybeRefOrGetter, Ref } from 'vue';
import { useCesiumEventListener } from '../useCesiumEventListener';

import { useViewer } from '../useViewer';

export interface UseScaleBarOptions {
  /**
   * The maximum width of the scale (px)
   * @default 100
   */
  maxPixel?: MaybeRefOrGetter<number>;

  /**
   * Throttling calculation interval (ms)
   * @default 8
   */
  ms?: number;
}

export interface UseScaleBarRetrun {
  /**
   * The actual distance of a single pixel in the current canvas
   */
  pixelDistance: Readonly<Ref<number>>;

  /**
   * The width of the scale.(px)
   */
  width: Readonly<Ref<number>>;

  /**
   * The actual distance corresponding to the width of the scale (m)
   */
  distance: Readonly<Ref<number>>;

  /**
   * Formatted content of distance.
   * eg. 100m,100km
   */
  label: Readonly<Ref<string>>;
}

const distances = [
  50000000,
  30000000,
  20000000,
  10000000,
  5000000,
  3000000,
  2000000,
  1000000,
  500000,
  300000,
  200000,
  100000,
  50000,
  30000,
  20000,
  10000,
  5000,
  3000,
  2000,
  1000,
  500,
  300,
  200,
  100,
  50,
  30,
  20,
  10,
  5,
  3,
  2,
  1,
];

/**
 * Reactive generation of scale bars
 */
export function useScaleBar(options: UseScaleBarOptions = {}): UseScaleBarRetrun {
  const { maxPixel, ms = 8 } = options;
  const maxPixelRef = computed(() => toValue(maxPixel) || 100);

  const viewer = useViewer();
  const canvasSize = useElementSize(() => viewer.value?.canvas);

  const pixelDistance = ref(0);

  useCesiumEventListener(
    () => viewer.value?.camera.changed,
    throttle(
      () => {
        const scene = viewer.value?.scene;
        if (!scene) {
          return;
        }
        const left = scene.camera.getPickRay(new Cartesian2(Math.floor(canvasSize.width.value / 2), canvasSize.height.value - 1));
        const right = scene.camera.getPickRay(new Cartesian2(Math.floor(1 + canvasSize.width.value / 2), canvasSize.height.value - 1));
        if (!left || !right) {
          return;
        }
        const leftPosition = scene.globe.pick(left, scene);
        const rightPosition = scene.globe.pick(right, scene);
        if (!leftPosition || !rightPosition) {
          return;
        }
        const leftCartographic = scene.globe.ellipsoid.cartesianToCartographic(leftPosition);
        const rightCartographic = scene.globe.ellipsoid.cartesianToCartographic(rightPosition);
        const geodesic = new EllipsoidGeodesic(leftCartographic, rightCartographic);
        pixelDistance.value = geodesic.surfaceDistance;
      },
      ms,
    ),
  );

  const distance = computed(() => {
    const _pixelDistance = pixelDistance.value;
    return distances.find(item => _pixelDistance * maxPixelRef.value < item)!;
  });

  const width = computed(() => distance.value / pixelDistance.value);
  const label = computed(() => distance.value > 1000 ? `${(distance.value / 1000) | 0}km` : `${(distance.value | 0)}m`);

  return {
    pixelDistance: readonly(pixelDistance),
    width,
    distance,
    label,
  };
}
