import type { Cartesian3, Entity } from 'cesium';
import type { VNode } from 'vue';
import type { SmapledPlottedPackable } from './SmapledPlottedProperty';
import { assertError } from '@cesium-vueuse/shared';

export enum PlottedStatus {
  IDLE = 0,
  DEFINING = 1,
  ACTIVE = 2,
  DISABLED = 3,
}

export enum PlottedPointAction {
  IDLE = 0,
  ACTIVE = 1,
  OPERATING = 2,
  HOVER = 3,
}

export interface PlottedRenderResult {
  entities?: Entity[];
  primitives?: any[];
}

export interface PlottedRenderOptions<D = any> {
  packable: SmapledPlottedPackable<D>;
  status: PlottedStatus;
  mouse?: Cartesian3;
  prev: PlottedRenderResult;
}

export interface PlottedHandlePointTipOptions {
  position: Cartesian3;
  status: PlottedStatus;
  action: PlottedPointAction;
}

/**
 * 标绘辅助操作点渲染配置
 */
export interface PlottedHandlePointOptions {
  diabled?: boolean;
  format?: (packable: SmapledPlottedPackable, status: PlottedStatus) => Cartesian3[];
  render?: (options: PlottedHandlePointTipOptions) => Entity.ConstructorOptions | undefined;
  tip?: (options: PlottedHandlePointTipOptions) => string | VNode | string | undefined;
}

export interface PlottedSchemeConstructorOptions {
  type: string;

  /**
   * 是否立即执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回`true`则标绘完成
   */
  complete?: (packable: SmapledPlottedPackable) => boolean;

  /**
   * 双击时，是否执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回 true 则下一次双击事件执行完成
   */
  completeOnDoubleClick?: (packable: SmapledPlottedPackable) => boolean;

  /**
   * 控制点渲染
   */
  controlPoint?: PlottedHandlePointOptions;

  /**
   * 间隔渲染
   */
  intervalPoint?: PlottedHandlePointOptions;

  /**
   * 移动点渲染
   */
  movedPoint?: PlottedHandlePointOptions;

  /**
   * 海拔点渲染
   */
  altitudePoint?: PlottedHandlePointOptions;

  /**
   * 海拔点渲染
   */
  heightPoint?: PlottedHandlePointOptions;

  /**
   * 删除点渲染
   */
  deletePoint?: PlottedHandlePointOptions;

  /**
   */
  render?: (options: PlottedRenderOptions) => PlottedRenderResult | Promise<PlottedRenderResult>;
}

export class PlottedScheme {
  constructor(options: PlottedSchemeConstructorOptions) {
    this.type = options.type;
    this.complete = options.complete;
    this.completeOnDoubleClick = options.completeOnDoubleClick;
    this.render = options.render;

    this.controlPoint = options.controlPoint;
    this.intervalPoint = options.intervalPoint;
    this.movedPoint = options.movedPoint;
    this.altitudePoint = options.altitudePoint;
    this.heightPoint = options.heightPoint;
    this.deletePoint = options.deletePoint;
  }

  /**
   * @internal
   */
  private static _record = new Map<string, PlottedScheme>();

  static getRecordTypes(): string[] {
    return [...this._record.keys()];
  }

  static getRecord(type: string): PlottedScheme | undefined {
    return PlottedScheme._record.get(type);
  }

  static setRecord(scheme: PlottedScheme): void {
    assertError(!scheme.type, '`scheme.type` is required');
    PlottedScheme._record.set(scheme.type, scheme);
  }

  type: string;

  /**
   * 是否立即执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回`true`则标绘完成
   */
  complete?: (packable: SmapledPlottedPackable) => boolean;

  /**
   * 双击时，是否执行完成标绘操作
   *
   */
  completeOnDoubleClick?: (packable: SmapledPlottedPackable) => boolean;

  /**
   */
  render?: (options: PlottedRenderOptions) => PlottedRenderResult | Promise<PlottedRenderResult>;

  /**
   * 控制点渲染
   */
  controlPoint?: PlottedHandlePointOptions;

  /**
   * 间隔渲染
   */
  intervalPoint?: PlottedHandlePointOptions;

  /**
   * 移动点渲染
   */
  movedPoint?: PlottedHandlePointOptions;

  /**
   * 海拔点渲染
   */
  altitudePoint?: PlottedHandlePointOptions;

  /**
   * 海拔点渲染
   */
  heightPoint?: PlottedHandlePointOptions;

  /**
   * 删除点渲染
   */
  deletePoint?: PlottedHandlePointOptions;
}
