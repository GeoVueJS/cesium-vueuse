import type { PlotConstructorOptions } from '../usePlot/Plot';
import { CallbackPositionProperty, Entity } from 'cesium';
import { moved } from '../skeleton';

/**
 *  标签文字标绘方案
 */
export const PLOT_LABEL_SCHEME: PlotConstructorOptions = {
  scheme: {
    type: 'Label',
    complete: packable => packable.positions!.length >= 1,
    skeletons: [
      moved,
    ],
    render(options) {
      const { mouse, packable } = options;
      const entity = options.previous.entities?.[0]
        ?? new Entity({
          label: {
            text: 'Label',
          },
        });
      const position = packable.positions?.[0] ?? mouse;
      entity.position = new CallbackPositionProperty(() => position, true);

      return {
        entities: [entity],
      };
    },
  },
};
