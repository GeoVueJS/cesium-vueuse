import type { Property } from 'cesium';
import { Cartesian3, Event, JulianDate, TimeInterval } from 'cesium';

/**
 * 标绘采集到的数据
 */
export interface SampledPlotPackable<D = any> {
  time: JulianDate;
  positions?: Cartesian3[];
  derivative?: D;
}

export enum SampledPlotStrategy {
  NEAR = 0,
  CYCLE = 1,
  STRICT = 2,
}

export type SampledPlotInterpolationAlgorithm<D = any> = (
  time: JulianDate,
  previous: SampledPlotPackable<D>,
  next: SampledPlotPackable<D>,
  proportion: number
) => SampledPlotPackable;

/**
 * 默认插值算法
 *
 * @param time 时间
 * @param previous 前一个数据点
 * @param next 后一个数据点
 * @param proportion 比例
 * @returns 插值结果
 */
const defaultInterpolationAlgorithm: SampledPlotInterpolationAlgorithm = (time, previous, next, proportion) => {
  if (proportion === 0) {
    return {
      time,
      positions: previous.positions?.map(item => item.clone()),
      derivative: previous.derivative,
    };
  }
  else if (proportion === 1) {
    return {
      time,
      positions: next.positions?.map(item => item.clone()),
      derivative: previous.derivative,
    };
  }

  return {
    time,
    positions: next.positions?.map((right, index) => {
      const left = previous.positions?.[index];
      return !left ? right : Cartesian3.lerp(left, right, proportion, new Cartesian3());
    }),
    derivative: previous.derivative,
  };
};

export interface SampledPlotPropertyConstructorOptions<D = any> {
  interpolationAlgorithm?: SampledPlotInterpolationAlgorithm<D>;
  strategy?: SampledPlotStrategy;
  packables?: SampledPlotPackable<D>[];
}

/**
 * 标绘属性数据
 */
export class SampledPlotProperty<D = any> {
  constructor(options?: SampledPlotPropertyConstructorOptions<D>) {
    this.interpolationAlgorithm = options?.interpolationAlgorithm;
    this.strategy = options?.strategy ?? SampledPlotStrategy.NEAR;
    options?.packables?.forEach(packable => this.setSample(packable));
    // 默认将初始化一项数据
    if (!this._times.length) {
      this.setSample({
        time: JulianDate.now(),
        positions: [],
        derivative: undefined,
      });
    }
  }

  static defaultInterpolationAlgorithm: SampledPlotInterpolationAlgorithm<any> = defaultInterpolationAlgorithm;

  strategy: SampledPlotStrategy;

  interpolationAlgorithm?: SampledPlotInterpolationAlgorithm;

  /**
   * @internal
   */
  private _times: JulianDate[] = [];

  /**
   * @internal
   */
  private _sampleds: Cartesian3[][] = [];

  /**
   * @internal
   */
  private _derivatives: (D | undefined)[] = [];

  get isConstant(): boolean {
    return this._times.length === 0;
  };

  /**
   * @internal
   */
  private _definitionChanged = new Event<(...args: any[]) => void>();

  get definitionChanged(): Event<(...args: any[]) => void> {
    return this._definitionChanged;
  };

  /**
   * 获取时间数组
   *
   * @returns 返回包含所有时间的 JulianDate 数组
   */
  getTimes(): JulianDate[] {
    return this._times.map(t => t.clone());
  }

  /**
   * 根据给定的儒略日期获取时间索引范围及比例
   *
   * @param time 给定的儒略日期
   * @returns 返回包含前一个索引、后一个索引及时间比例的对象，若不符合条件则返回undefined
   * @internal
   */
  private getIndexScope(time: JulianDate): { prevIndex: number; nextIndex: number; proportion: number } | undefined {
    if (!this._times.length) {
      return;
    }
    const start = this._times[0];
    const end = this._times[this._times.length - 1];
    if (JulianDate.lessThan(time, start) || JulianDate.greaterThan(time, end)) {
      switch (this.strategy) {
        case SampledPlotStrategy.STRICT: {
          return;
        }
        case SampledPlotStrategy.NEAR: {
          time = JulianDate.lessThan(time, this._times[0])
            ? this._times[0].clone()
            : this._times[this._times.length - 1].clone();
          break;
        }
        case SampledPlotStrategy.CYCLE: {
          const startMS = JulianDate.toDate(this._times[0]).getTime();
          const endMS = JulianDate.toDate(this._times[this._times.length - 1]).getTime();
          const duration = endMS - startMS;
          const timeMS = JulianDate.toDate(time).getTime();
          const diff = (timeMS - startMS) % duration;
          const dete = new Date(startMS + diff);
          time = JulianDate.fromDate(dete);
          break;
        }
      }
    }

    const prevIndex = this._times.findIndex(t => JulianDate.lessThanOrEquals(time, t));
    const nextIndex = Math.min(prevIndex, this._times.length - 1);
    const prevMs = JulianDate.toDate(this._times[prevIndex]).getTime();
    const nextMs = JulianDate.toDate(this._times[nextIndex]).getTime();
    const ms = JulianDate.toDate(time).getTime();

    return {
      prevIndex,
      nextIndex,
      proportion: ((ms - prevMs) / (nextMs - prevMs)) || 0,
    };
  }

  /**
   * 根据给定的儒略日期（JulianDate）获取插值后的样本点数据。
   *
   * @param time 指定的儒略日期（JulianDate）。
   * @param result 可选参数，用于存储结果的容器。如果未提供，则创建一个新的容器。
   * @returns 插值后的样本点数据，存储在提供的或新创建的result容器中。
   * @template D 数据类型。
   */
  getValue(time: JulianDate, result?: SampledPlotPackable): SampledPlotPackable<D> {
    result ??= { time };
    Object.assign(result, {
      time: time.clone(),
      positions: undefined,
      derivative: undefined,
    });

    if (!time) {
      result.time = this._times[0]?.clone();
      result.positions = this._sampleds[0]?.map(c => c.clone(c));
      result.derivative = this._derivatives[0];
      return result;
    }
    const scope = this.getIndexScope(time);
    if (!scope) {
      return result;
    }

    result.time = time;
    const { prevIndex, nextIndex, proportion } = scope;
    const previous: SampledPlotPackable<D> = {
      time: this._times[prevIndex],
      positions: this._sampleds[prevIndex],
      derivative: this._derivatives[prevIndex],
    };
    const next: SampledPlotPackable<D> = {
      time: this._times[nextIndex],
      positions: this._sampleds[nextIndex],
      derivative: this._derivatives[nextIndex],
    };
    const packable = (this.interpolationAlgorithm || SampledPlotProperty.defaultInterpolationAlgorithm)(time, previous, next, proportion);
    Object.assign(result, packable);
    return result;
  }

  /**
   * 设置样本数据
   *
   * @param value 样本数据对象，包含时间、位置和导数信息
   */
  setSample(value: SampledPlotPackable<D>): void {
    const time = value.time.clone();
    const positions = value.positions?.map(item => item.clone()) ?? [];
    const derivative = value.derivative;
    const index = this._times.findIndex(t => JulianDate.equals(time, t));

    if (index !== -1) {
      this._times[index] = time;
      this._sampleds[index] = positions;
      this._derivatives[index] = value.derivative;
    }
    else if (this._times.length === 0) {
      this._times[0] = time;
      this._sampleds[0] = positions;
      this._derivatives[0] = value.derivative;
    }
    else if (JulianDate.lessThan(time, this._times[0])) {
      this._times.splice(0, 0, time);
      this._sampleds.splice(0, 0, positions);
      this._derivatives.splice(0, 0, derivative);
    }
    else if (JulianDate.greaterThan(time, this._times[this._times.length - 1])) {
      this._times.push(time);
      this._sampleds.push(positions);
      this._derivatives.push(derivative);
    }

    this.definitionChanged.raiseEvent(this);
  }

  /**
   * 设置样本数据
   *
   * @param values 样本数据数组，每个元素都是类型为SampledPlotPackable<D>的对象
   */
  setSamples(values: SampledPlotPackable<D>[]): void {
    values.forEach(value => this.setSample(value));
  }

  /**
   * 从样本中移除指定时间点的数据
   *
   * @param time 需要移除的时间点，使用儒略日期表示
   * @returns 如果成功移除，则返回 true；否则返回 false
   */
  removeSample(time: JulianDate): boolean {
    const index = this._times.findIndex(t => t.equals(time));
    if (index !== -1) {
      this._sampleds.splice(index, 1);
      this._derivatives.splice(index, 1);
      const removed = this._times.splice(index, 1);
      if (removed.length) {
        this._definitionChanged.raiseEvent(this);
        return true;
      }
    }
    return false;
  }

  /**
   * 从样本中移除指定时间间隔内的样本。
   *
   * @param interval 要移除样本的时间间隔
   */
  removeSamples(interval: TimeInterval): void {
    for (let i = 0; i < this._times.length; i++) {
      const time = this._times[i];
      TimeInterval.contains(interval, time) && this.removeSample(time);
    }
  }

  equals(other?: Property): boolean {
    return other === this;
  }
}
