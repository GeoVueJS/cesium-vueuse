import type { Entity, JulianDate } from 'cesium';
import type { PlotSchemeConstructorOptions } from './PlotScheme';
import type { PlotSkeletonEntity } from './PlotSkeletonEntity';
import type { SampledPlotPropertyConstructorOptions } from './SampledPlotProperty';
import { assertError, createCesiumAttribute, createCesiumProperty } from '@cesium-vueuse/shared';
import { notNullish } from '@vueuse/core';
import { createGuid, Event } from 'cesium';
import { PlotScheme } from './PlotScheme';
import { SampledPlotProperty } from './SampledPlotProperty';

export interface PlotConstructorOptions {
  id?: string;
  disabled?: boolean;
  scheme: string | PlotScheme | PlotSchemeConstructorOptions;
  sample?: SampledPlotProperty | SampledPlotPropertyConstructorOptions;
}

export class Plot {
  constructor(options: PlotConstructorOptions) {
    assertError(!notNullish(options.scheme), 'options.scheme is required');

    this.id = options.id || createGuid();
    createCesiumAttribute(this, 'disabled', !!options.disabled);
    createCesiumAttribute(this, 'defining', true);
    createCesiumAttribute(this, 'scheme', PlotScheme.resolve(options.scheme), { readonly: true });
    const sample = options.sample instanceof SampledPlotProperty ? options.sample : new SampledPlotProperty(options.sample);
    createCesiumProperty(this, 'sample', sample);
    createCesiumAttribute(this, 'entities', []);
    createCesiumAttribute(this, 'primitives', []);
    createCesiumAttribute(this, 'groundPrimitives', []);
    createCesiumAttribute(this, 'skeletonEntities', []);
  }

  /**
   * @internal
   */
  private _definitionChanged = new Event();

  get definitionChanged(): Event<(scope: Plot, key: keyof Plot, newValue: Plot[typeof key], oldValue: Plot[typeof key]) => void> {
    return this._definitionChanged;
  }

  time?: JulianDate;

  declare id: string;

  declare disabled: boolean;

  declare readonly scheme: PlotScheme;

  declare sample: SampledPlotProperty;

  /**
   * @internal
   */
  declare defining: boolean;

  isDefining(): boolean {
    return this.defining;
  }

  /**
   * @internal
   */
  declare entities: Entity[];

  getEntities(): Entity[] {
    return [...this.entities];
  }

  /**
   * @internal
   */
  declare primitives: any[];

  getPrimitives(): any[] {
    return [...this.primitives];
  }

  /**
   * @internal
   */
  declare groundPrimitives: any[];

  getGroundPrimitives(): any[] {
    return [...this.groundPrimitives];
  }

  /**
   * @internal
   */
  declare skeletonEntities: PlotSkeletonEntity[];

  /**
   * 获取该标绘的骨架点entity数组
   *
   */
  getSkeletonEntities(): PlotSkeletonEntity[] {
    return [...this.skeletonEntities];
  }
}
