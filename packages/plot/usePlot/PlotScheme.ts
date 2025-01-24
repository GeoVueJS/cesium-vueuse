import type { Cartesian3, Entity } from 'cesium';
import type { PlotSkeleton } from './PlotSkeleton';
import type { SmapledPlotPackable } from './SmapledPlotProperty';
import { assertError } from '@cesium-vueuse/shared';
import { assert } from '@vueuse/core';

export interface PlotRenderResult {
  entities?: Entity[];
  primitives?: any[];
  groundPrimitives?: any[];
}

export interface PlotRenderOptions<D = any> {
  packable: SmapledPlotPackable<D>;
  defining: boolean;
  mouse?: Cartesian3;
  previous: PlotRenderResult;
}

export interface PlotSchemeConstructorOptions {
  type: string;

  /**
   * 是否立即执行完成标绘操作
   * 每次控制点发生变变化时，执行该回调函数，如果返回`true`则标绘完成
   */
  complete?: (packable: SmapledPlotPackable) => boolean;

  /**
   * 双击时，是否执行完成标绘操作
   * 每次控制点发生变变化时，执行该回调函数，如果返回 true 则下一次双击事件执行完成
   */
  forceComplete?: (packable: SmapledPlotPackable) => boolean;

  /**
   * 框架点渲染配置
   */
  skeletons?: (() => PlotSkeleton) [];

  /**
   */
  render?: (options: PlotRenderOptions) => PlotRenderResult | Promise<PlotRenderResult>;

}

export class PlotScheme {
  constructor(options: PlotSchemeConstructorOptions) {
    this.type = options.type;
    this.complete = options.complete;
    this.forceComplete = options.forceComplete;
    this.render = options.render;
    this.skeletons = options.skeletons ?? [];
  }

  type: string;

  /**
   * 是否立即执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回`true`则标绘完成
   */
  complete?: (packable: SmapledPlotPackable) => boolean;

  /**
   * 双击时，是否执行完成标绘操作
   */
  forceComplete?: (packable: SmapledPlotPackable) => boolean;

  /**
   * 框架点渲染配置
   */
  skeletons?: (() => PlotSkeleton) [];

  /**
   */
  render?: (options: PlotRenderOptions) => PlotRenderResult | Promise<PlotRenderResult>;

  /**
   * @internal
   */
  private static _record = new Map<string, PlotScheme>();

  static getRecordTypes(): string[] {
    return [...this._record.keys()];
  }

  static getRecord(type: string): PlotScheme | undefined {
    return PlotScheme._record.get(type);
  }

  static setRecord(scheme: PlotScheme): void {
    assertError(!scheme.type, '`scheme.type` is required');
    PlotScheme._record.set(scheme.type, scheme);
  }

  /**
   * 解析传入的 scheme，并返回 PlotScheme 实例
   */
  static resolve(maybeScheme: string | PlotScheme | PlotSchemeConstructorOptions): PlotScheme {
    if (typeof maybeScheme === 'string') {
      const _scheme = PlotScheme.getRecord(maybeScheme);
      assert(!!_scheme, `scheme ${maybeScheme} not found`);
      maybeScheme = _scheme!;
    }
    else if (!(maybeScheme instanceof PlotScheme)) {
      maybeScheme = new PlotScheme(maybeScheme);
    }
    return maybeScheme;
  }
}
