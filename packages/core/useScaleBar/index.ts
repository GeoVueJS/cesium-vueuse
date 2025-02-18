import type { MaybeRefOrGetter, Ref } from 'vue';
import { throttle } from '@vesium/shared';
import { useElementSize, watchImmediate } from '@vueuse/core';
import { Cartesian2, EllipsoidGeodesic } from 'cesium';
import { computed, nextTick, readonly, ref, toValue } from 'vue';
import { useCesiumEventListener } from '../useCesiumEventListener';
import { useViewer } from '../useViewer';

export interface UseScaleBarOptions {
  /**
   * The maximum width of the scale (px)
   * @default 80
   */
  maxPixel?: MaybeRefOrGetter<number>;

  /**
   * Throttled delay duration (ms)
   * @default 8
   */
  delay?: number;
}

export interface UseScaleBarRetrun {
  /**
   * The actual distance of a single pixel in the current canvas
   */
  pixelDistance: Readonly<Ref<number | undefined>>;

  /**
   * The width of the scale.(px)
   */
  width: Readonly<Ref<number>>;

  /**
   * The actual distance corresponding to the width of the scale (m)
   */
  distance: Readonly<Ref<number | undefined>>;

  /**
   * Formatted content of distance.
   * eg. 100m,100km
   */
  distanceText: Readonly<Ref<string | undefined>>;
}

const distances = [
  0.01,
  0.05,
  0.1,
  0.5,
  1,
  2,
  3,
  5,
  10,
  20,
  30,
  50,
  100,
  200,
  300,
  500,
  1000,
  2000,
  3000,
  5000,
  10000,
  20000,
  30000,
  50000,
  100000,
  200000,
  300000,
  500000,
  1000000,
  2000000,
  3000000,
  5000000,
  10000000,
  20000000,
  30000000,
  50000000,
].reverse();

/**
 * Reactive generation of scale bars
 */
export function useScaleBar(options: UseScaleBarOptions = {}): UseScaleBarRetrun {
  const { maxPixel = 80, delay = 8 } = options;
  const maxPixelRef = computed(() => toValue(maxPixel));

  const viewer = useViewer();
  const canvasSize = useElementSize(() => viewer.value?.canvas);

  const pixelDistance = ref<number>();

  const setPixelDistance = async () => {
    await nextTick();
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
  };

  watchImmediate(viewer, () => setPixelDistance());

  useCesiumEventListener(
    () => viewer.value?.camera.changed,
    throttle(setPixelDistance, delay),
  );

  const distance = computed(() => {
    if (pixelDistance.value) {
      return distances.find(item => pixelDistance.value! * maxPixelRef.value > item);
    }
  });

  const width = computed(() => {
    if (distance.value && pixelDistance.value) {
      const value = distance.value / pixelDistance.value;
      return value;
    }
    return 0;
  });
  const distanceText = computed(() => {
    if (distance.value) {
      return distance.value > 1000 ? `${(distance.value / 1000) || 0}km` : `${(distance.value || 0)}m`;
    }
  });

  return {
    pixelDistance: readonly(pixelDistance),
    width,
    distance,
    distanceText,
  };
}
