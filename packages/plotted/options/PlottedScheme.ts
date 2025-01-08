import type { Cartesian3, Entity } from 'cesium';
import type { PlottedScaffold } from './PlottedScaffold';
import type { SmapledPlottedPackable } from './SmapledPlottedProperty';
import { assertError } from '@cesium-vueuse/shared';

export enum PlottedStatus {
  IDLE = 0,
  DEFINING = 1,
  ACTIVE = 2,
  DISABLED = 3,
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
   */
  render?: (options: PlottedRenderOptions) => PlottedRenderResult | Promise<PlottedRenderResult>;

  /**
   * 控制点渲染
   */
  controlPoint?: PlottedScaffold;

  /**
   * 间隔渲染
   */
  intervalPoint?: PlottedScaffold;

  /**
   * 移动点渲染
   */
  movedPoint?: PlottedScaffold;

  /**
   * 海拔（高程）点渲染
   */
  altitudePoint?: PlottedScaffold;

  /**
   * 高度点渲染
   */
  heightPoint?: PlottedScaffold;

  /**
   * 删除点渲染
   */
  deletePoint?: PlottedScaffold;

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
  controlPoint?: PlottedScaffold;

  /**
   * 间隔渲染
   */
  intervalPoint?: PlottedScaffold;

  /**
   * 移动点渲染
   */
  movedPoint?: PlottedScaffold;

  /**
   * 海拔点渲染
   */
  altitudePoint?: PlottedScaffold;

  /**
   * 海拔点渲染
   */
  heightPoint?: PlottedScaffold;

  /**
   * 删除点渲染
   */
  deletePoint?: PlottedScaffold;

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
}
