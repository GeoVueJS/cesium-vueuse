import type { Cartesian2 } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { refThrottled } from '@vueuse/core';
import { computed, toValue } from 'vue';
import { useViewer } from '../useViewer';

export interface UseSceneDrillPickOptions {

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
   * If supplied, stop drilling after collecting this many picks.
   */
  limit?: MaybeRefOrGetter<number | undefined>;

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
 * Uses the `scene.drillPick` function to perform screen point picking,
 * return a computed property containing the pick result, or undefined if no object is picked.
 *
 * @param windowPosition The screen coordinates of the pick point.
 */
export function useSceneDrillPick(
  windowPosition: MaybeRefOrGetter<Cartesian2 | undefined>,
  options: UseSceneDrillPickOptions = {},
): ComputedRef<any [] | undefined> {
  const { width = 3, height = 3, limit, throttled = 8, isActive = true } = options;

  const viewer = useViewer();

  const position = refThrottled(computed(() => toValue(windowPosition)), throttled, false, true);

  const pick = computed(() => {
    if (position.value && toValue(isActive)) {
      return viewer.value?.scene.drillPick(
        position.value,
        toValue(limit),
        toValue(width),
        toValue(height),
      );
    }
  });

  return pick;
}
