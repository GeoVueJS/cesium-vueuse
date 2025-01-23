import type { PlotSkeleton } from '../usePlot/PlotSkeleton';
import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { Cartesian3, Color } from 'cesium';
import { PlotAction } from '../usePlot/PlotSkeleton';

/**
 * 绘制非封闭的间隔框架点，如线段。拖拽时，会在两点之间插入一个控制点，并持续拖拽该点。
 */
export function intervalNonclosed(): PlotSkeleton {
  let dragIndex = -1;
  return {
    diabled: ({ active, defining }) => !active || defining,
    cursor: type => type === 'drag' ? 'crosshair' : 'grab',
    format(packable) {
      const _positions = packable.positions ?? [];
      if (_positions.length < 2) {
        return [];
      }
      return _positions.slice(0, _positions.length - 1).map((position, i) => {
        return Cartesian3.midpoint(position, _positions[i + 1], new Cartesian3());
      });
    },
    onDrag({ viewer, smaple, packable, context, index, lockCamera, draging }) {
      lockCamera(draging);
      const position = canvasCoordToCartesian(context.endPosition, viewer.scene);
      if (!position) {
        return;
      }
      const positions = [...packable.positions ?? []];
      if (dragIndex === -1) {
        dragIndex = index;
        positions.splice(index + 1, 0, position);
      }
      else {
        positions[dragIndex + 1] = position;
      }
      if (!draging) {
        dragIndex = -1;
      }
      smaple.setSample({
        time: packable.time,
        derivative: packable.derivative,
        positions,
      });
    },
    render: ({ position, action }) => {
      const colors = {
        [PlotAction.IDLE]: Color.GREEN.withAlpha(0.6),
        [PlotAction.HOVER]: Color.GREEN.withAlpha(0.8),
        [PlotAction.OPERATING]: Color.GREEN.withAlpha(0.6),
        [PlotAction.ACTIVE]: Color.GREEN.withAlpha(0.6),
      };
      return {
        position,
        point: {
          pixelSize: 6,
          color: colors[action],
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          outlineWidth: 1,
          outlineColor: Color.WHITE.withAlpha(0.4),
        },
      };
    },
  };
}
