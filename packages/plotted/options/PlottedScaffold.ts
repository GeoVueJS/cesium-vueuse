import type { Cartesian3, Entity } from 'cesium';
import type { VNode } from 'vue';
import type { SmapledPlottedPackable } from './SmapledPlottedProperty';
import { Color } from 'cesium';
import { PlottedStatus } from './PlottedScheme';

export enum PlottedAction {
  IDLE = 0,
  HOVER = 1,
  ACTIVE = 2,
  OPERATING = 3,
}

export interface PlottedScaffoldRenderOptions {
  packable: SmapledPlottedPackable;
  count: number;
  index: number;
  position: Cartesian3;
  status: PlottedStatus;
  action: PlottedAction;
}

export interface PlottedScaffoldConstructorOptions {
  diabled?: boolean | ((status: PlottedStatus) => boolean);
  render?: (options: PlottedScaffoldRenderOptions) => Entity.ConstructorOptions | undefined;
  tip?: (options: PlottedScaffoldRenderOptions) => string | VNode | string | undefined;
}

export class PlottedScaffold {
  constructor(options: PlottedScaffoldConstructorOptions) {
    this.diabled = options.diabled;
    this.render = options.render;
    this.tip = options.tip;
  }

  diabled?: boolean | ((status: PlottedStatus) => boolean);
  render?: (options: PlottedScaffoldRenderOptions) => Entity.ConstructorOptions | undefined;
  tip?: (options: PlottedScaffoldRenderOptions) => string | VNode | string | undefined;

  static merge(left: PlottedScaffold, right: PlottedScaffold): PlottedScaffold {
    return new PlottedScaffold({
      diabled: left.diabled ?? right.diabled,
      render: left.render ?? right.render,
      tip: left.tip ?? right.tip,
    });
  }

  /**
   * 默认的控制点样式
   */
  static DEFUALT_CONTROL = new PlottedScaffold({
    diabled: status => status !== PlottedStatus.ACTIVE,
    render: ({ position, action }) => {
      const colors = {
        [PlottedAction.IDLE]: Color.BLUE.withAlpha(0.6),
        [PlottedAction.HOVER]: Color.BLUE.withAlpha(0.8),
        [PlottedAction.OPERATING]: Color.AQUA.withAlpha(0.6),
        [PlottedAction.ACTIVE]: Color.AQUA.withAlpha(0.8),
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
  });

  static DEFUALT_INTERVAL = new PlottedScaffold({
    diabled: status => status !== PlottedStatus.ACTIVE,
    render: ({ position, action }) => {
      const colors = {
        [PlottedAction.IDLE]: Color.GREEN.withAlpha(0.6),
        [PlottedAction.HOVER]: Color.GREEN.withAlpha(0.8),
        [PlottedAction.OPERATING]: Color.AQUA.withAlpha(0.6),
        [PlottedAction.ACTIVE]: Color.GREEN.withAlpha(0.8),
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
  });

  static DEFUALT_INTERVAL_NOLOOP = new PlottedScaffold({
    diabled: status => status !== PlottedStatus.ACTIVE,
    render: ({ packable, position, index, action }) => {
      if (index === packable.positions!.length - 1) {
        return;
      }
      const colors = {
        [PlottedAction.IDLE]: Color.GREEN.withAlpha(0.6),
        [PlottedAction.HOVER]: Color.GREEN.withAlpha(0.8),
        [PlottedAction.OPERATING]: Color.AQUA.withAlpha(0.6),
        [PlottedAction.ACTIVE]: Color.GREEN.withAlpha(0.8),
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
  });
}
