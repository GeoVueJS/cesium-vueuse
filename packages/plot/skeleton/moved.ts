import type { PlotSkeleton } from '../usePlot/PlotSkeleton';
import { canvasCoordToCartesian, toCartesian3 } from '@cesium-vueuse/shared';
import { Cartesian3, HorizontalOrigin, Rectangle, VerticalOrigin } from 'cesium';

// see https://icones.js.org/collection/tabler?s=move&icon=tabler:arrows-move
const svg = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path  stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m18 9l3 3l-3 3m-3-3h6M6 9l-3 3l3 3m-3-3h6m0 6l3 3l3-3m-3-3v6m3-15l-3-3l-3 3m3-3v6"/></svg>',
)}`;

/**
 * 绘制非封闭的间隔框架点，如线段。拖拽时，会在两点之间插入一个控制点，并持续拖拽该点。
 */
export function moved(): PlotSkeleton {
  return {
    diabled: ({ active, defining }) => !active,
    cursor: type => type === 'drag' ? 'crosshair' : 'grab',
    format(packable) {
      const _positions = packable.positions ?? [];
      if (_positions.length < 2) {
        return [];
      }
      const center = Rectangle.center(Rectangle.fromCartesianArray(_positions));
      return [toCartesian3(center)!];
    },
    onDrag({ viewer, smaple, packable, context, lockCamera, draging }) {
      lockCamera(draging);
      const startPosition = canvasCoordToCartesian(context.startPosition, viewer.scene);
      const endPosition = canvasCoordToCartesian(context.endPosition, viewer.scene);

      if (!startPosition || !endPosition) {
        return;
      }
      const offset = Cartesian3.subtract(endPosition, startPosition, new Cartesian3());
      const positions = [...packable.positions ?? []];

      smaple.setSample({
        time: packable.time,
        derivative: packable.derivative,
        positions: positions.map(position => Cartesian3.add(position, offset, new Cartesian3())),
      });
    },
    onKeyPressed(options) {
      console.log(options);
    },
    render: ({ position }) => {
      return {
        position,
        billboard: {
          image: svg,
          width: 20,
          height: 20,
          pixelOffset: new Cartesian3(0, -20),
          horizontalOrigin: HorizontalOrigin.CENTER,
          verticalOrigin: VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      };
    },
  };
}
