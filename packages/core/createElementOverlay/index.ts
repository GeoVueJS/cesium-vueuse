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
   * 目标元素水平参照
   * @default `center`
   */
  horizontalOrigin?: MaybeRefOrGetter<'center' | 'left' | 'right' | undefined>;

  /**
   * 目标元素垂直参照
   * @default `bottom`
   */
  verticalOrigin?: MaybeRefOrGetter<'center' | 'bottom' | 'top' | undefined>;

  /**
   * 像素偏移量
   * @default {x:0,y:0}
   */
  offset?: MaybeRefOrGetter<{ x: number; y: number } | undefined>;

  /**
   * 位置计算基准
   * true：参照浏览器视窗,false: 参照cesium画布
   * @default false
   */
  referenceWindow?: MaybeRefOrGetter<boolean>;

  /**
   * 位置刷新时间间隔 ms
   * @default 8
   */
  ms?: number;
}

export interface CreateElementOverlayRetrun {
  x: ComputedRef<number>;
  y: ComputedRef<number>;
  style: ComputedRef<{ left: string; top: string }>;
}

/**
 * 创建Cesium一个元素覆盖层
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
    style,
    x,
    y,
  };
}
