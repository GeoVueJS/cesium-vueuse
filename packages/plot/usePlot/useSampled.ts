import type { Nullable } from '@vesium/shared';
import type { JulianDate } from 'cesium';
import type { CSSProperties, ShallowRef } from 'vue';
import type { Plot } from './Plot';
import { useCesiumEventListener, useScreenSpaceEventHandler, useViewer } from '@vesium/core';
import { canvasCoordToCartesian, isFunction } from '@vesium/shared';
import { promiseTimeout } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { computed, ref, toValue, watch } from 'vue';

export function useSampled(
  current: ShallowRef<Plot | undefined>,
  getCurrentTime: () => JulianDate,
): void {
  const viewer = useViewer();
  const doubleClicking = ref(false);

  const packable = computed(() => {
    return current.value?.sample.getValue(getCurrentTime());
  });

  // 左键点击添加点
  useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_CLICK,
    async (ctx) => {
      await promiseTimeout(1);
      if (!current.value || !packable.value) {
        return;
      }
      // 双击会触发两次事件, 这里做一个防抖处理，只需触发一次事件
      if (doubleClicking.value) {
        return;
      }
      const { scheme, defining, sample } = current.value;
      if (!defining) {
        return;
      }
      const position = canvasCoordToCartesian(ctx.position, viewer.value!.scene);
      if (!position) {
        return;
      }
      packable.value.positions ??= [];
      packable.value.positions.push(position);
      sample.setSample(packable.value);
      const completed = scheme.complete?.(packable.value);
      completed && (current.value.defining = false);
    },
  );

  // 双击结束定义态,进入激活态
  useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    async (ctx) => {
      if (!current.value || !packable.value) {
        return;
      }
      doubleClicking.value = true;
      await promiseTimeout(2);
      doubleClicking.value = false;

      const { scheme, defining } = current.value;
      if (!defining) {
        return;
      }
      const position = canvasCoordToCartesian(ctx.position, viewer.value!.scene);
      if (!position) {
        return;
      }

      const completed = scheme.forceComplete?.(packable.value);
      completed && (current.value.defining = false);
    },
  );

  // 右键回退到上一个点
  useScreenSpaceEventHandler(
    ScreenSpaceEventType.RIGHT_CLICK,
    async () => {
      if (!current.value || !packable.value) {
        return;
      }
      const { defining, sample } = current.value;

      if (!defining) {
        return;
      }
      packable.value.positions ??= [];
      if (packable.value.positions.length === 0) {
        return;
      }
      packable.value.positions.splice(packable.value.positions.length - 1, 1);
      sample.setSample(packable.value);
    },
  );

  // 定义态时的鼠标样式
  const definingCursorCss = ref<Nullable<CSSProperties['cursor']>>();

  const setDefiningCursorCss = () => {
    if (!current.value?.defining) {
      if (definingCursorCss.value) {
        definingCursorCss.value = undefined;
        viewer.value!.container.parentElement!.style.removeProperty('cursor');
      }
    }
    else {
      const definingCursor = current.value!.scheme.definingCursor;
      definingCursorCss.value = isFunction(definingCursor) ? definingCursor(packable.value!) : toValue(definingCursor);
      if (definingCursorCss.value) {
        viewer.value?.container.parentElement!.style.setProperty('cursor', definingCursorCss.value);
      }
    }
  };

  useCesiumEventListener(() => current.value?.definitionChanged, (plot, key) => {
    if (key === 'defining' || key === 'sample') {
      setDefiningCursorCss();
    }
  });
  watch(current, () => setDefiningCursorCss());
}
