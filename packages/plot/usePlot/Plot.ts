import type { Entity, JulianDate } from 'cesium';
import type { PlotSchemeConstructorOptions } from './PlotScheme';
import type { SmapledPlotPropertyConstructorOptions } from './SmapledPlotProperty';
import { assertError, createCesiumAttribute, createCesiumProperty } from '@cesium-vueuse/shared';
import { notNullish } from '@vueuse/core';
import { createGuid, Event } from 'cesium';
import { PlotScheme } from './PlotScheme';
import { SmapledPlotProperty } from './SmapledPlotProperty';

export interface PlotConstructorOptions {
  id?: string;
  disabled?: boolean;
  scheme: string | PlotScheme | PlotSchemeConstructorOptions;
  smaple?: SmapledPlotProperty | SmapledPlotPropertyConstructorOptions;
}

export class Plot {
  constructor(options: PlotConstructorOptions) {
    assertError(!notNullish(options.scheme), 'options.scheme is required');

    this.id = options.id || createGuid();
    createCesiumAttribute(this, 'disabled', !!options.disabled);
    createCesiumAttribute(this, 'defining', true);
    createCesiumAttribute(this, 'scheme', PlotScheme.resolve(options.scheme), { readonly: true });
    const smaple = options.smaple instanceof SmapledPlotProperty ? options.smaple : new SmapledPlotProperty(options.smaple);
    createCesiumProperty(this, 'smaple', smaple);
    createCesiumAttribute(this, 'entities', []);
    createCesiumAttribute(this, 'primitives', []);
    createCesiumAttribute(this, 'groundPrimitives', []);
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

  declare smaple: SmapledPlotProperty;

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

  /**
   * @internal
   */
  declare primitives: any[];

  /**
   * @internal
   */
  declare groundPrimitives: any[];

  getEntities(): Entity[] {
    return [...this.entities];
  }

  getPrimitives(): any[] {
    return [...this.primitives];
  }

  getGroundPrimitives(): any[] {
    return [...this.groundPrimitives];
  }
}
