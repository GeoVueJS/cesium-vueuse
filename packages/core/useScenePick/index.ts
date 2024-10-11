import type { Cartesian2 } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';
import { useViewer } from '../useViewer';

export interface UseScenePickOptions {
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
  const viewer = useViewer();

  const pick = computed(() => {
    const position = toValue(windowPosition);
    if (position) {
      const width = toValue(options.width);
      const height = toValue(options.height);
      return viewer.value?.scene.pick(position, width, height);
    }
  });

  return pick;
}
