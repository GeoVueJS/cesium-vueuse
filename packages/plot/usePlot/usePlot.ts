import type { ShallowRef } from 'vue';
import type { PlotConstructorOptions } from './Plot';
import type { SmapledPlotPackable } from './SmapledPlotProperty';
import { useCesiumEventListener, useScreenSpaceEventHandler } from '@cesium-vueuse/core';
import { useViewer } from '@cesium-vueuse/core/useViewer';
import { pickHitGraphic } from '@cesium-vueuse/shared';
import { JulianDate, ScreenSpaceEventType } from 'cesium';
import { computed, shallowReactive, shallowRef, watch } from 'vue';
import { Plot } from './Plot';
import { useRender } from './useRender';
import { useSkeleton } from './useSkeleton';
import { useSmapled } from './useSmapled';

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
  const packable = shallowRef<SmapledPlotPackable>();

  useCesiumEventListener([
    () => current.value?.smaple.definitionChanged,
  ], () => {
    packable.value = current.value?.smaple.getValue(getCurrentTime());
  });

  useSmapled(current, getCurrentTime);
  const { dataSource, primitives, groundPrimitives } = useRender(plots, current, getCurrentTime);
  const { skeletonDataSources } = useSkeleton(plots, current, getCurrentTime);

  // 单击激活
  useScreenSpaceEventHandler(ScreenSpaceEventType.LEFT_CLICK, (data) => {
    if (current.value?.defining) {
      return;
    }
    const pick = viewer.value?.scene.pick(data.position);
    for (let i = 0; i < plots.value.length; i++) {
      const plot = plots.value[i];
      const hit = pickHitGraphic(pick, plot);
      if (hit) {
        current.value = plot;
        break;
      }
    }
  });

  watch(current, (plot, previous) => {
    if (previous && previous.defining) {
      const packable = previous.smaple.getValue(getCurrentTime());
      const completed = previous.scheme.forceComplete?.(packable);
      if (completed) {
        previous.defining = false;
      }
    }
  });

  const operate: UsePlotOperate = async (plot) => {
    const _plot = plot instanceof Plot ? plot : new Plot(plot);

    if (!collection.has(_plot)) {
      collection.add(_plot);
    }

    const previous = current.value;
    if (previous) {
      const completed = previous.scheme.forceComplete?.(previous.smaple.getValue(getCurrentTime()));
      if (completed) {
        previous.defining = false;
      }
    }

    current.value = _plot;
    return _plot;
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

  const cancel = () => {
  };

  return {
    plots,
    time,
    operate,
    remove,
    cancel,
  };
}
