import type { Cartesian3, Entity } from 'cesium';
import type { SmapledPlottedPackable } from './SmapledPlottedProperty';
import { assertError } from '@cesium-vueuse/shared';

export enum PlottedStatus {
  IDLE = 0,
  DEFINING = 1,
  ACTIVE = 2,
  DISABLED = 3,
}

export enum PlottedPointStatus {
  DEFINING = 1,
  ACTIVE = 2,
  DRAGING = 3,
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

export type PlottedHandlePointsRender<D = any> = (packable: SmapledPlottedPackable<D>, status?: PlottedStatus, prev?: Entity[]) => Entity[];

export interface PlottedSchemeConstructorOptions {
  type: string;

  /**
   * 是否立即执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回`true`则标绘完成
   */
  complete?: (positions: Cartesian3[]) => boolean;

  /**
   * 双击时，是否执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回 true 则下一次双击事件执行完成
   */
  completeOnDoubleClick?: (positions: Cartesian3[]) => boolean;

  /**
   */
  render?: (options: PlottedRenderOptions) => PlottedRenderResult | Promise<PlottedRenderResult>;

  /**
   * 控制点渲染
   */
  controlPoint?: PlottedHandlePointsRender;

  /**
   * 辅助点渲染
   */
  auxiliaryPoint?: PlottedHandlePointsRender;

  /**
   * 移动点渲染
   */
  movedPoint?: PlottedHandlePointsRender;

  /**
   * 海拔点渲染
   */
  altitudePoint?: PlottedHandlePointsRender;

  /**
   * 高度点渲染
   */
  heightPoint?: PlottedHandlePointsRender;

}

export class PlottedScheme {
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

  constructor(options: PlottedSchemeConstructorOptions) {
    this.type = options.type;
    this.complete = options.complete;
    this.completeOnDoubleClick = options.completeOnDoubleClick;
    this.render = options.render;

    this.controlPoint = options.controlPoint;
    this.auxiliaryPoint = options.auxiliaryPoint;
    this.movedPoint = options.movedPoint;
    this.altitudePoint = options.altitudePoint;
    this.heightPoint = options.heightPoint;
  }

  type: string;

  /**
   * 是否立即执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回`true`则标绘完成
   */
  complete?: (positions: Cartesian3[]) => boolean;

  /**
   * 双击时，是否执行完成标绘操作
   *
   */
  completeOnDoubleClick?: (positions: Cartesian3[]) => boolean;

  /**
   */
  render?: (options: PlottedRenderOptions) => PlottedRenderResult | Promise<PlottedRenderResult>;

  /**
   * 控制点渲染
   */
  controlPoint?: PlottedHandlePointsRender;

  /**
   * 辅助点渲染
   */
  auxiliaryPoint?: PlottedHandlePointsRender;

  /**
   * 移动点渲染
   */
  movedPoint?: PlottedHandlePointsRender;

  /**
   * 海拔点渲染
   */
  altitudePoint?: PlottedHandlePointsRender;

  /**
   * 高度点渲染
   */
  heightPoint?: PlottedHandlePointsRender;
}
