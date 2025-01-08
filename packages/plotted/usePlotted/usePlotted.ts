import type { ShallowRef } from 'vue';
import type { PlottedProduct, PlottedProductConstructorOptions } from '../options/PlottedProduct';
import type { SmapledPlottedPackable } from '../options/SmapledPlottedProperty';
import { useCesiumEventListener } from '@cesium-vueuse/core';
import { useViewer } from '@cesium-vueuse/core/useViewer';
import { isString } from '@cesium-vueuse/shared';
import { JulianDate } from 'cesium';
import { shallowReactive, shallowRef } from 'vue';
import { useProduct } from './useProduct';
import { useScaffoldControl } from './useScaffoldControl';
import { useScaffoldInterval } from './useScaffoldInterval';
import { useSmapled } from './useSmapled';

export interface UsePlottedOptions {
  time?: ShallowRef<JulianDate | undefined>;
}

export type UsePlottedExecute = (product: string | PlottedProduct | PlottedProductConstructorOptions) => Promise<PlottedProduct>;

export interface UsePlottedRetrun {

  time: ShallowRef<JulianDate | undefined>;

  data?: ShallowRef<PlottedProduct[]>;

  current?: ShallowRef<PlottedProduct | undefined>;
  /**
   * 触发标绘
   */
  execute: UsePlottedExecute;

  /**
   * 强制终止当前进行中的标绘
   */
  cancel: VoidFunction;
}

export function usePlotted(options?: UsePlottedOptions): UsePlottedRetrun {
  const time = options?.time || shallowRef<JulianDate>();

  const viewer = useViewer();

  const getCurrentTime = () => {
    return time.value?.clone() || viewer.value?.clock.currentTime?.clone() || JulianDate.now();
  };

  const data = shallowReactive(new Set<PlottedProduct>());

  const current = shallowRef<PlottedProduct>();
  const packable = shallowRef<SmapledPlottedPackable>();

  useCesiumEventListener([
    () => current.value?.statusChanged,
    () => current.value?.smaple.definitionChanged,
  ], () => {
    packable.value = current.value?.smaple.getValue(getCurrentTime());
  });

  useSmapled(current, getCurrentTime);
  useProduct(current, getCurrentTime);
  useScaffoldControl(current, packable);
  useScaffoldInterval(current, packable);
  const execute: UsePlottedExecute = async (product) => {
    const result = isString(product)
      ? new PlottedProduct({ scheme: product })
      : product instanceof PlottedProduct
        ? product
        : new PlottedProduct(product);
    current.value = result;
    return result;
  };

  const cancel = () => {
  };

  return {
    time,
    execute,
    cancel,
  };
}
