import type { Plot } from '..';
import type { PlotSkeleton } from './PlotSkeleton';
import { Entity } from 'cesium';

/**
 * 标绘框架点 Entity
 */
export class PlotSkeletonEntity extends Entity {
  constructor(options: Entity.ConstructorOptions) {
    super(options);
  }

  /**
   * @internal
   */
  declare plot: Plot;

  /**
   * @internal
   */
  declare skeleton: PlotSkeleton;

  /**
   * @internal
   */
  declare index: number;
}
