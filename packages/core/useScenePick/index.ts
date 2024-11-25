import type { Cartesian2 } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { refThrottled } from '@vueuse/core';
import { computed, toValue } from 'vue';
import { useViewer } from '../useViewer';

export interface UseScenePickOptions {
  /**
   * Whether to activate the pick function.
   * @default true
   */
  isActive?: MaybeRefOrGetter<boolean | undefined>;

  /**
   * Throttled sampling (ms)
   * @default 8
   */
  throttled?: number;

  /**
   * The width of the pick rectangle.
   * @default 3
   */
  width?: MaybeRefOrGetter<number | undefined>;

  /**
   * The height of the pick rectangle.
   * @default 3
   */
  height?: MaybeRefOrGetter<number | undefined>;

}

/**
 * Uses the `scene.pick` function in Cesium's Scene object to perform screen point picking,
 * return a computed property containing the pick result, or undefined if no object is picked.
 *
 * @param windowPosition The screen coordinates of the pick point.
 */
export function useScenePick(
  windowPosition: MaybeRefOrGetter<Cartesian2 | undefined>,
  options: UseScenePickOptions = {},
): ComputedRef<any | undefined> {
  const { width = 3, height = 3, throttled = 8, isActive = true } = options;
  const viewer = useViewer();
  const position = refThrottled(computed(() => toValue(windowPosition)), throttled, false, true);

  const pick = computed(() => {
    if (position.value && toValue(isActive)) {
      return viewer.value?.scene.pick(
        position.value,
        toValue(width),
        toValue(height),
      );
    }
  });

  return pick;
}
