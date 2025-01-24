import type { PlotSkeleton } from '../usePlot/PlotSkeleton';
import { canvasCoordToCartesian } from '@cesium-vueuse/shared';
import { Color } from 'cesium';
import { PlotAction } from '../usePlot/PlotSkeleton';

/**
 * 绘制控制的框架点，拖拽时，将更新该控制点的实时位置
 */
export function control(): PlotSkeleton {
  return {
    diabled: ({ active }) => !active,
    cursor: 'grab',
    dragCursor: 'crosshair',
    onDrag({ viewer, smaple, packable, context, index, dragging, defining, lockCamera }) {
      if (defining) {
        return;
      }
      dragging && lockCamera();
      const position = canvasCoordToCartesian(context.endPosition, viewer.scene);
      if (position) {
        const positions = [...packable.positions ?? []];
        positions[index] = position;
        smaple.setSample({
          time: packable.time,
          derivative: packable.derivative,
          positions,
        });
      }
    },
    render: ({ position, action }) => {
      const colors = {
        [PlotAction.IDLE]: Color.BLUE.withAlpha(0.6),
        [PlotAction.HOVER]: Color.BLUE.withAlpha(1),
        [PlotAction.OPERATING]: Color.AQUA.withAlpha(0.6),
        [PlotAction.ACTIVE]: Color.AQUA.withAlpha(1),
      };
      return {
        position,
        point: {
          pixelSize: 8,
          color: colors[action],
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          outlineWidth: 1,
          outlineColor: Color.WHITE.withAlpha(0.4),
        },
      };
    },
  };
}
