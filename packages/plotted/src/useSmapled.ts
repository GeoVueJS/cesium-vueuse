import type { JulianDate } from 'cesium';
import type { ShallowRef } from 'vue';
import type { PlottedProduct } from './PlottedProduct';
import { useScreenSpaceEventHandler, useViewer } from '@cesium-vueuse/core';
import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { ScreenSpaceEventType } from 'cesium';
import { PlottedStatus } from './PlottedScheme';

export interface UseSmapledOptions {
}

export interface UseSmapledRetrun {
}

export function useSmapled(
  current: ShallowRef<PlottedProduct | undefined>,
  getCurrentTime: () => JulianDate,
): void {
  const viewer = useViewer();

  useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_CLICK,
    (ctx) => {
      if (!current.value) {
        return;
      }
      const { scheme, status, smaple } = current.value;
      if (status !== PlottedStatus.DEFINING) {
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
      completed && current.value.setStatus(PlottedStatus.ACTIVE);
    },
  );

  useScreenSpaceEventHandler(
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    (ctx) => {
      // 双击结束定义态,进入激活态
      if (!current.value) {
        return;
      }
      const { scheme, status, smaple } = current.value;
      if (status !== PlottedStatus.DEFINING) {
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
      const completed = scheme.completeOnDoubleClick?.(packable);
      completed && current.value.setStatus(PlottedStatus.ACTIVE);
    },
  );
}
