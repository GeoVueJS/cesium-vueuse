import type { PlotConstructorOptions } from '../usePlot/Plot';
import { CallbackProperty, Entity } from 'cesium';
import { control } from '../skeleton/control';
import { intervalNonclosed } from '../skeleton/intervalNonclosed';
import { moved } from '../skeleton/moved';

/**
 * 内置的线段标绘方案
 */
export const PLOT_LINE_STRING_SCHEME: PlotConstructorOptions = {
  scheme: {
    type: 'LineString',
    forceComplete: packable => packable.positions!.length >= 2,
    skeletons: [
      control,
      intervalNonclosed,
      moved,
    ],
    render(options) {
      const { mouse, packable } = options;
      const entity = options.previous.entities?.[0]
        ?? new Entity({
          polyline: {
            width: 1,
          },
        });
      entity.polyline!.positions = new CallbackProperty(() => {
        const positions = [...packable.positions ?? []].concat(mouse ? [mouse] : []);
        return positions.length >= 2 ? positions : [];
      }, false);

      return {
        entities: [entity],
      };
    },
  },
};
