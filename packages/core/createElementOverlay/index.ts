import { cartesianToCanvasCoord, throttle, toCartesian3 } from '@cesium-vueuse/shared';
import { useElementBounding } from '@vueuse/core';
import { computed, shallowRef, toValue } from 'vue';

import type { CommonCoord } from '@cesium-vueuse/shared';
import type { MaybeComputedElementRef } from '@vueuse/core';

import type { Cartesian2 } from 'cesium';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { useCesiumEventListener } from '../useCesiumEventListener';
import { useViewer } from '../useViewer';

export interface CreateElementOverlayOptions {
  /**
   * Horizontal origin of the target element
   * @default `center`
   */
  horizontalOrigin?: MaybeRefOrGetter<'center' | 'left' | 'right' | undefined>;

  /**
   * Vertical origin of the target element
   * @default `bottom`
   */
  verticalOrigin?: MaybeRefOrGetter<'center' | 'bottom' | 'top' | undefined>;

  /**
   * Pixel offset presented by the target element
   * @default {x:0,y:0}
   */
  offset?: MaybeRefOrGetter<{ x: number; y: number } | undefined>;

  /**
   * The reference element for calculating the position of the target element
   *  - `true` refer to the browser viewport
   *  - `false` refer to the Cesium canvas
   * @default false
   */
  referenceWindow?: MaybeRefOrGetter<boolean>;

  /**
   * Throttling interval when refreshing position
   * @default 8
   */
  ms?: number;
}

export interface CreateElementOverlayRetrun {
  /**
   * Calculation result of the target element's horizontal direction
   */
  x: ComputedRef<number>;

  /**
   * Calculation result of the target element's vertical direction
   */
  y: ComputedRef<number>;

  /**
   * Calculation `css` of the target element
   */
  style: ComputedRef<{ left: string; top: string }>;
}

/**
 * Create a Cesium HtmlElement Overlay
 */
export function createElementOverlay(
  target?: MaybeComputedElementRef,
  position?: MaybeRefOrGetter<CommonCoord | undefined>,
  options: CreateElementOverlayOptions = {},
): CreateElementOverlayRetrun {
  const {
    ms = 8,
    referenceWindow,
    horizontalOrigin = 'center',
    verticalOrigin = 'bottom',
    offset = { x: 0, y: 0 },
  } = options;

  const cartesian3 = computed(() => {
    return toCartesian3(toValue(position));
  });

  const viewer = useViewer();
  const coord = shallowRef<Cartesian2>();

  useCesiumEventListener(() => viewer.value?.scene.postRender, throttle(() => {
    if (!cartesian3.value) {
      coord.value = undefined;
    }
    else {
      const result = cartesianToCanvasCoord(cartesian3.value, viewer.value!.scene);
      coord.value = result;
    }
  }, ms));

  const canvasBounding = useElementBounding(() => viewer.value?.canvas.parentElement);
  const targetBounding = useElementBounding(target);

  const finalOffset = computed(() => {
    const _offset = toValue(offset);
    let x = _offset?.x ?? 0;
    const horizontal = toValue(horizontalOrigin);
    if (horizontal === 'center') {
      x -= targetBounding.width.value / 2;
    }
    else if (horizontal === 'right') {
      x -= targetBounding.width.value;
    }

    let y = _offset?.y ?? 0;
    const vertical = toValue(verticalOrigin);
    if (vertical === 'center') {
      y -= targetBounding.height.value / 2;
    }
    else if (vertical === 'bottom') {
      y -= targetBounding.height.value;
    }

    return {
      x,
      y,
    };
  });

  const location = computed(() => {
    const data = {
      x: coord.value?.x ?? 0,
      y: coord.value?.y ?? 0,
    };
    if (toValue(referenceWindow)) {
      data.x += canvasBounding.x.value;
      data.y += canvasBounding.y.value;
    }
    return {
      x: finalOffset.value.x + data.x,
      y: finalOffset.value.y + data.y,
    };
  });
  const x = computed(() => location.value.x);
  const y = computed(() => location.value.y);

  const style = computed(() => {
    return {
      left: `${x}px`,
      top: `${y}px`,
    };
  });

  return {
    x,
    y,
    style,
  };
}
