import type { Cartesian2 } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';
import { useViewer } from '../useViewer';

export interface UseSceneDrillPickOptions {
  /**
   * If supplied, stop drilling after collecting this many picks.
   */
  limit?: number;

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
  const viewer = useViewer();

  const pick = computed(() => {
    const position = toValue(windowPosition);
    if (position) {
      const limit = toValue(options.limit);
      const width = toValue(options.width);
      const height = toValue(options.height);
      return viewer.value?.scene.drillPick(position, limit, width, height);
    }
  });

  return pick;
}
