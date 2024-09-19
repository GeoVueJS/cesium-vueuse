import { refThrottled } from '@vueuse/core';
import { computed, shallowRef, toValue, watch } from 'vue';
import type { Camera, Cartesian3, Cartographic, Rectangle } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { useCesiumEventListener } from '../useCesiumEventListener';
import { useViewer } from '../useViewer';

export interface UseCameraStateOptions {
  /**
   * The camera to use
   * @default useViewer().value.scene.camera
   */
  camera?: MaybeRefOrGetter<Camera | undefined>;

  /**
   * Camera event type to watch
   * @edfualt `changed`
   */
  event?: MaybeRefOrGetter<'changed' | 'moveStart' | 'moveEnd'> ;

  /**
   * Throttled delay duration (ms)
   * @default 8
   */
  delay?: number;
}

export interface UseCameraStateRetrun {
  camera: ComputedRef<Camera | undefined>;

  /**
   * The position of the camera.
   */
  position: ComputedRef<Cartesian3 | undefined>;

  /**
   * The view direction of the camera.
   */
  direction: ComputedRef<Cartesian3 | undefined>;

  /**
   * The up direction of the camera.
   */
  up: ComputedRef<Cartesian3 | undefined>;

  /**
   * The right direction of the camera.
   */
  right: ComputedRef<Cartesian3 | undefined>;

  /**
   * Gets the {@link Cartographic} position of the camera, with longitude and latitude
   * expressed in radians and height in meters.  In 2D and Columbus View, it is possible
   * for the returned longitude and latitude to be outside the range of valid longitudes
   * and latitudes when the camera is outside the map.
   */
  positionCartographic: ComputedRef<Cartographic | undefined>;

  /**
   * Gets the position of the camera in world coordinates.
   */
  positionWC: ComputedRef<Cartesian3 | undefined>;

  /**
   * Gets the view direction of the camera in world coordinates.
   */
  directionWC: ComputedRef<Cartesian3 | undefined>;

  /**
   * Gets the up direction of the camera in world coordinates.
   */
  upWC: ComputedRef<Cartesian3 | undefined>;

  /**
   * Gets the right direction of the camera in world coordinates.
   */
  rightWC: ComputedRef<Cartesian3 | undefined>;

  /**
   * Computes the approximate visible rectangle on the ellipsoid.
   */
  viewRectangle: ComputedRef<Rectangle | undefined>;

  /**
   * Gets the camera heading in radians.
   */
  heading: ComputedRef<number | undefined>;

  /**
   * Gets the camera pitch in radians.
   */
  pitch: ComputedRef<number | undefined>;

  /**
   * Gets the camera roll in radians.
   */
  roll: ComputedRef<number | undefined>;

  /**
   * Gets the camera center hierarchy level
   */
  level: ComputedRef<number | undefined>;

}

/**
 *  Reactive Cesium Camera state
 */
export function useCameraState(options: UseCameraStateOptions = {}): UseCameraStateRetrun {
  let getCamera = options.camera;
  if (!getCamera) {
    const viewer = useViewer();
    getCamera = () => viewer.value?.scene.camera;
  }

  const camera = computed(() => toValue(getCamera));

  const event = computed(() => {
    const eventField = toValue(options.event) || 'changed';
    return camera.value?.[eventField];
  });

  const changedSymbol = refThrottled(
    shallowRef(Symbol('camera change')),
    options.delay ?? 8,
    true,
    false,
  );

  const setChangedSymbol = () => changedSymbol.value = Symbol('camera change');

  watch(camera, () => setChangedSymbol());
  useCesiumEventListener(event, () => setChangedSymbol());

  const level = computed(() =>
    (changedSymbol.value && camera.value!.positionCartographic.height)
      ? computeLevel(camera.value!.positionCartographic.height)
      : undefined);

  return {
    camera,
    position: computed(() => changedSymbol.value ? camera.value?.position : undefined),
    direction: computed(() => changedSymbol.value ? camera.value?.direction : undefined),
    up: computed(() => changedSymbol.value ? camera.value?.up : undefined),
    right: computed(() => changedSymbol.value ? camera.value?.right : undefined),
    positionCartographic: computed(() => changedSymbol.value ? camera.value?.positionCartographic : undefined),
    positionWC: computed(() => changedSymbol.value ? camera.value?.positionWC : undefined),
    directionWC: computed(() => changedSymbol.value ? camera.value?.directionWC : undefined),
    upWC: computed(() => changedSymbol.value ? camera.value?.directionWC : undefined),
    rightWC: computed(() => changedSymbol.value ? camera.value?.directionWC : undefined),
    viewRectangle: computed(() => changedSymbol.value ? camera.value?.computeViewRectangle() : undefined),
    heading: computed(() => changedSymbol.value ? camera.value?.heading : undefined),
    pitch: computed(() => changedSymbol.value ? camera.value?.pitch : undefined),
    roll: computed(() => changedSymbol.value ? camera.value?.roll : undefined),
    level,
  };
}

const A = 40487.57;
const B = 0.00007096758;
const C = 91610.74;
const D = -40467.74;

/**
 * Compute the camera level at a given height.
 */
function computeLevel(height: number): number {
  return D + (A - D) / (1 + (height! / C) ** B);
}
