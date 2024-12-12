import type { Cartesian3, InterpolationAlgorithm, JulianDate, Property, TimeInterval } from 'cesium';
import { Event } from 'cesium';

export interface SmapledPositionsPackable<D = any> {
  time?: JulianDate;
  positions?: Cartesian3[];
  derivative?: D;
}

export enum SmapledPositionsStrategy {
  NEAR = 0,
  INTERVAL = 1,
  CYCLE = 2,
}

export interface SmapledPositionsPropertyConstructorOptions {
  interpolationAlgorithm?: () => void;
  strategy?: SmapledPositionsStrategy;
}

export class SmapledPositionsProperty<D = any> {
  constructor(options?: SmapledPositionsPropertyConstructorOptions) {
    this.interpolationAlgorithm = options?.interpolationAlgorithm ?? (() => {});
    this.strategy = options?.strategy ?? SmapledPositionsStrategy.NEAR;
  }

  strategy: SmapledPositionsStrategy;

  interpolationAlgorithm: InterpolationAlgorithm;

  /**
   * @internal
   */
  private _times: JulianDate[] = [];

  /**
   * @internal
   */
  private _smapleds: Cartesian3[] = [];

  /**
   * @internal
   */
  private _derivatives: D[] = [];

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

  getValue(time?: JulianDate, result?: SmapledPositionsPackable): SmapledPositionsPackable {
    result ??= {

    };

    return result;
  }

  setSample(time: JulianDate, positions: Cartesian3, derivative?: D): void {
    throw new Error('Method not implemented.');
  }

  addSamples(times: JulianDate[], positions: Cartesian3[], derivatives?: D[]): void {
    throw new Error('Method not implemented.');
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
    this._times = this._times.filter(t => !interval.contains(t));
    throw new Error('Method not implemented.');
  }

  equals(other?: Property): boolean {
    throw new Error('Method not implemented.');
  }
}
