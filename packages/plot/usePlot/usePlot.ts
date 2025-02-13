import type { ShallowRef } from 'vue';
import type { PlotConstructorOptions } from './Plot';
import type { SampledPlotPackable } from './SampledPlotProperty';
import { useCesiumEventListener, useScreenSpaceEventHandler } from '@cesium-vueuse/core';
import { useViewer } from '@cesium-vueuse/core/useViewer';
import { pickHitGraphic } from '@cesium-vueuse/shared';
import { JulianDate, ScreenSpaceEventType } from 'cesium';
import { computed, shallowReactive, shallowRef, watch } from 'vue';
import { Plot } from './Plot';
import { useRender } from './useRender';
import { useSampled } from './useSampled';
import { useSkeleton } from './useSkeleton';

export interface UsePlotOptions {
  time?: ShallowRef<JulianDate | undefined>;
}

export type UsePlotOperate = (plot: Plot | PlotConstructorOptions) => Promise<Plot>;

export interface UsePlotRetrun {

  time: ShallowRef<JulianDate | undefined>;

  data?: ShallowRef<Plot[]>;

  current?: ShallowRef<Plot | undefined>;
  /**
   * 触发标绘
   */
  operate: UsePlotOperate;

  /**
   * 强制终止当前进行中的标绘
   */
  cancel: VoidFunction;
}

export function usePlot(options?: UsePlotOptions) {
  const time = options?.time || shallowRef<JulianDate>();

  const viewer = useViewer();

  const getCurrentTime = () => {
    return time.value?.clone() || viewer.value?.clock.currentTime?.clone() || JulianDate.now();
  };

  const collection = shallowReactive(new Set<Plot>());
  const plots = computed(() => Array.from(collection));
  const current = shallowRef<Plot>();
  const packable = shallowRef<SampledPlotPackable>();

  useCesiumEventListener([
    () => current.value?.sample.definitionChanged,
  ], () => {
    packable.value = current.value?.sample.getValue(getCurrentTime());
  });

  useSampled(current, getCurrentTime);
  useRender(plots, current, getCurrentTime);
  useSkeleton(plots, current, getCurrentTime);

  // 单击激活
  useScreenSpaceEventHandler(ScreenSpaceEventType.LEFT_CLICK, (data) => {
    if (current.value?.defining) {
      return;
    }
    const pick = viewer.value?.scene.pick(data.position.clone());
    // 点击到了骨架点则不处理
    if (pick?.id?.plot instanceof Plot) {
      return;
    }
    if (!pick) {
      current.value = undefined;
      return;
    }
    current.value = plots.value.find(plot => pickHitGraphic(pick, [...plot.entities, ...plot.primitives, ...plot.groundPrimitives]));
  });

  let operateResolve: ((plot: Plot) => void) | undefined;
  let operateReject: (() => void) | undefined;

  watch(current, (plot, previous) => {
    if (previous) {
      if (previous.defining) {
        const packable = previous.sample.getValue(getCurrentTime());
        const completed = previous.scheme.forceComplete?.(packable);
        if (completed) {
          previous.defining = false;
          operateResolve?.(previous);
        }
        else {
          collection.delete(previous);
        }
      }
    }
  });

  const operate: UsePlotOperate = async (plot) => {
    return new Promise((resolve, reject) => {
      operateResolve = resolve;
      operateReject = reject;
      const _plot = plot instanceof Plot ? plot : new Plot(plot);

      if (!collection.has(_plot)) {
        collection.add(_plot);
      }
      current.value = _plot;
      return resolve(_plot);
    });
  };

  const remove = (plot: Plot): boolean => {
    if (plot === current.value) {
      current.value = undefined;
    }
    if (collection.has(plot)) {
      collection.delete(plot);
      return true;
    }
    return false;
  };

  return {
    plots,
    time,
    operate,
    remove,
    cancel: operateReject,
  };
}
