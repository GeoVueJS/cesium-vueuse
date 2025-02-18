import type { PlotSkeleton } from '../usePlot/PlotSkeleton';
import { canvasCoordToCartesian } from '@vesium/shared';
import { Cartesian3, Color } from 'cesium';
import { PlotAction } from '../usePlot/PlotSkeleton';

/**
 * 绘制封闭的间隔框架点，如多边形。拖拽时，会在两点之间插入一个控制点，并持续拖拽该点。
 */
export function interval(): PlotSkeleton {
  let dragIndex = -1;
  return {
    diabled: ({ active, defining }) => !active || defining,
    cursor: 'pointer',
    dragCursor: 'crosshair',
    format(packable) {
      const _positions = packable.positions ?? [];
      if (_positions.length < 2) {
        return [];
      }
      return _positions.map((position, i) => {
        const next = i === _positions.length - 1 ? _positions[0] : _positions[i + 1];
        return Cartesian3.midpoint(position, next, new Cartesian3());
      });
    },
    onDrag({ viewer, sample, packable, context, index, lockCamera, dragging }) {
      lockCamera();

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
      if (!dragging) {
        dragIndex = -1;
      }
      sample.setSample({
        time: packable.time,
        derivative: packable.derivative,
        positions,
      });
    },
    render: ({ position, action, active }) => {
      if (!active) {
        return;
      }
      const colors = {
        [PlotAction.IDLE]: Color.GREEN.withAlpha(0.4),
        [PlotAction.HOVER]: Color.GREEN.withAlpha(0.6),
        [PlotAction.ACTIVE]: Color.GREEN.withAlpha(1.0),
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
