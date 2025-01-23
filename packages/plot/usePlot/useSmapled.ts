import type { JulianDate } from 'cesium';
import type { ShallowRef } from 'vue';
import type { Plot } from './Plot';
import { useScreenSpaceEventHandler, useViewer } from '@cesium-vueuse/core';
import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { promiseTimeout } from '@vueuse/core';
import { ScreenSpaceEventType } from 'cesium';
import { ref } from 'vue';

export function useSmapled(
  current: ShallowRef<Plot | undefined>,
  getCurrentTime: () => JulianDate,
): void {
  const viewer = useViewer();
  const doubleClicking = ref(false);

  // 左键点击添加点
  useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_CLICK,
    async (ctx) => {
      await promiseTimeout(1);
      if (!current.value) {
        return;
      }
      // 双击会触发两次事件, 这里做一个防抖处理，只需触发一次事件
      if (doubleClicking.value) {
        return;
      }
      const { scheme, defining, smaple } = current.value;
      if (!defining) {
        return;
      }
      const position = canvasCoordToCartesian(ctx.position, viewer.value!.scene);
      if (!position) {
        return;
      }
      const packable = smaple.getValue(getCurrentTime());
      packable.positions ??= [];
      packable.positions.push(position);
      smaple.setSample(packable);
      const completed = scheme.complete?.(packable);
      completed && (current.value.defining = false);
    },
  );

  // 双击结束定义态,进入激活态
  useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    async (ctx) => {
      if (!current.value) {
        return;
      }
      doubleClicking.value = true;
      await promiseTimeout(2);
      doubleClicking.value = false;

      const { scheme, defining, smaple } = current.value;
      if (!defining) {
        return;
      }
      const position = canvasCoordToCartesian(ctx.position, viewer.value!.scene);
      if (!position) {
        return;
      }
      const packable = smaple.getValue(getCurrentTime());

      const completed = scheme.forceComplete?.(packable);
      completed && (current.value.defining = false);
    },
  );

  // 右键回退到上一个点
  useScreenSpaceEventHandler(
    ScreenSpaceEventType.RIGHT_CLICK,
    async () => {
      if (!current.value) {
        return;
      }
      const { defining, smaple } = current.value;

      if (!defining) {
        return;
      }
      const packable = smaple.getValue(getCurrentTime());
      packable.positions ??= [];
      if (packable.positions.length === 0) {
        return;
      }
      packable.positions.splice(packable.positions.length - 1, 1);
      smaple.setSample(packable);
    },
  );
}
