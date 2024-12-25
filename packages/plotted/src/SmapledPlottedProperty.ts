import type { Property } from 'cesium';
import { Cartesian3, Event, JulianDate, TimeInterval } from 'cesium';

export interface SmapledPlottedPackable<D = any> {
  time: JulianDate;
  positions?: Cartesian3[];
  derivative?: D;
}

export enum SmapledPlottedStrategy {
  NEAR = 0,
  CYCLE = 1,
  STRICT = 2,
}

export type SmapledPlottedInterpolationAlgorithm<D = any> = (
  time: JulianDate,
  prev: SmapledPlottedPackable<D>,
  next: SmapledPlottedPackable<D>,
  proportion: number
) => SmapledPlottedPackable;

const defaultInterpolationAlgorithm: SmapledPlottedInterpolationAlgorithm = (time, prev, next, proportion) => {
  if (proportion === 0) {
    return {
      time,
      positions: prev.positions?.map(item => item.clone()),
      derivative: prev.derivative,
    };
  }
  else if (proportion === 1) {
    return {
      time,
      positions: next.positions?.map(item => item.clone()),
      derivative: prev.derivative,
    };
  }

  return {
    time,
    positions: next.positions?.map((right, index) => {
      const left = prev.positions?.[index];
      return !left ? right : Cartesian3.lerp(left, right, proportion, new Cartesian3());
    }),
    derivative: prev.derivative,
  };
};

export interface SmapledPlottedPropertyConstructorOptions<D = any> {
  interpolationAlgorithm?: SmapledPlottedInterpolationAlgorithm<D>;
  strategy?: SmapledPlottedStrategy;
  packables?: SmapledPlottedPackable<D>[];
}

/**
 *
 */
export class SmapledPlottedProperty<D = any> {
  constructor(options?: SmapledPlottedPropertyConstructorOptions<D>) {
    this.interpolationAlgorithm = options?.interpolationAlgorithm;
    this.strategy = options?.strategy ?? SmapledPlottedStrategy.NEAR;
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

  static defaultInterpolationAlgorithm: SmapledPlottedInterpolationAlgorithm<any> = defaultInterpolationAlgorithm;

  strategy: SmapledPlottedStrategy;

  interpolationAlgorithm?: SmapledPlottedInterpolationAlgorithm;

  /**
   * @internal
   */
  private _times: JulianDate[] = [];

  /**
   * @internal
   */
  private _smapleds: Cartesian3[][] = [];

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

  getTimes(): JulianDate[] {
    return this._times.map(t => t.clone());
  }

  /**
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
        case SmapledPlottedStrategy.STRICT: {
          return;
        }
        case SmapledPlottedStrategy.NEAR: {
          time = JulianDate.lessThan(time, this._times[0])
            ? this._times[0].clone()
            : this._times[this._times.length - 1].clone();
          break;
        }
        case SmapledPlottedStrategy.CYCLE: {
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

  getValue(time: JulianDate, result?: SmapledPlottedPackable): SmapledPlottedPackable<D> {
    result ??= { time };
    Object.assign(result, {
      time: time.clone(),
      positions: undefined,
      derivative: undefined,
    });

    if (!time) {
      result.time = this._times[0]?.clone();
      result.positions = this._smapleds[0]?.map(c => c.clone(c));
      result.derivative = this._derivatives[0];
      return result;
    }
    const scope = this.getIndexScope(time);
    if (!scope) {
      return result;
    }

    result.time = time;
    const { prevIndex, nextIndex, proportion } = scope;
    const prev: SmapledPlottedPackable<D> = {
      time: this._times[prevIndex],
      positions: this._smapleds[prevIndex],
      derivative: this._derivatives[prevIndex],
    };
    const next: SmapledPlottedPackable<D> = {
      time: this._times[nextIndex],
      positions: this._smapleds[nextIndex],
      derivative: this._derivatives[nextIndex],
    };
    const packable = (this.interpolationAlgorithm || SmapledPlottedProperty.defaultInterpolationAlgorithm)(time, prev, next, proportion);
    Object.assign(result, packable);
    return result;
  }

  setSample(value: SmapledPlottedPackable<D>): void {
    const time = value.time.clone();
    const positions = value.positions?.map(item => item.clone()) ?? [];
    const derivative = value.derivative;
    const index = this._times.findIndex(t => JulianDate.equals(time, t));

    if (index !== -1) {
      this._times[index] = time;
      this._smapleds[index] = positions;
      this._derivatives[index] = value.derivative;
    }
    else if (this._times.length === 0) {
      this._times[0] = time;
      this._smapleds[0] = positions;
      this._derivatives[0] = value.derivative;
    }
    else if (JulianDate.lessThan(time, this._times[0])) {
      this._times.splice(0, 0, time);
      this._smapleds.splice(0, 0, positions);
      this._derivatives.splice(0, 0, derivative);
    }
    else if (JulianDate.greaterThan(time, this._times[this._times.length - 1])) {
      this._times.push(time);
      this._smapleds.push(positions);
      this._derivatives.push(derivative);
    }

    this.definitionChanged.raiseEvent(this);
  }

  setSamples(values: SmapledPlottedPackable<D>[]): void {
    values.forEach(value => this.setSample(value));
  }

  removeSample(time: JulianDate): boolean {
    const index = this._times.findIndex(t => t.equals(time));
    if (index !== -1) {
      this._smapleds.splice(index, 1);
      this._derivatives.splice(index, 1);
      const removed = this._times.splice(index, 1);
      if (removed.length) {
        this._definitionChanged.raiseEvent(this);
        return true;
      }
    }
    return false;
  }

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
