import type { Event, ExtrapolationType, InterpolationAlgorithm, JulianDate, Packable, Property, TimeInterval } from 'cesium';

export interface SmapledPlottedPropertyConstructorOptions {
}

export class SmapledPositionProperty {
  constructor(options?: SmapledPlottedPropertyConstructorOptions) {}
  isConstant: boolean;
  definitionChanged: Event<(...args: any[]) => void>;
  derivativeTypes: Packable[];
  interpolationDegree: number;
  interpolationAlgorithm: InterpolationAlgorithm;
  forwardExtrapolationType: ExtrapolationType;
  forwardExtrapolationDuration: number;
  backwardExtrapolationType: ExtrapolationType;
  backwardExtrapolationDuration: number;

  getValue(time?: JulianDate, result?: any) {
    throw new Error('Method not implemented.');
  }

  setInterpolationOptions(options?: { interpolationAlgorithm?: InterpolationAlgorithm; interpolationDegree?: number }): void {
    throw new Error('Method not implemented.');
  }

  setSample(time: JulianDate, value: Packable, derivatives?: Packable[]): void {
    throw new Error('Method not implemented.');
  }

  addSamples(times: JulianDate[], values: Packable[], derivativeValues?: any[][]): void {
    throw new Error('Method not implemented.');
  }

  addSamplesPackedArray(packedSamples: number[], epoch?: JulianDate): void {
    throw new Error('Method not implemented.');
  }

  removeSample(time: JulianDate): boolean {
    throw new Error('Method not implemented.');
  }

  removeSamples(time: TimeInterval): void {
    throw new Error('Method not implemented.');
  }

  equals(other?: Property): boolean {
    throw new Error('Method not implemented.');
  }
}
