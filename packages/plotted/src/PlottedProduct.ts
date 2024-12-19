import type { Entity } from 'cesium';
import type { PlottedSchemeConstructorOptions } from './PlottedScheme';
import type { SmapledPlottedPropertyConstructorOptions } from './SmapledPlottedProperty';
import { assertError } from '@cesium-vueuse/shared';
import { assert, notNullish } from '@vueuse/core';
import { createGuid, Event } from 'cesium';
import { PlottedScheme, PlottedStatus } from './PlottedScheme';
import { SmapledPlottedProperty } from './SmapledPlottedProperty';

export interface PlottedProductConstructorOptions {
  id?: string;
  scheme: string | PlottedScheme | PlottedSchemeConstructorOptions;
  smaple?: SmapledPlottedProperty | SmapledPlottedPropertyConstructorOptions;
}

export class PlottedProduct {
  constructor(options: PlottedProductConstructorOptions) {
    this.id = options.id || createGuid();

    assertError(!notNullish(options.scheme), 'options.scheme is required');

    if (typeof options.scheme === 'string') {
      const scheme = PlottedScheme.getRecord(options.scheme);
      assert(!!scheme, `scheme ${options.scheme} not found`);
      this._scheme = scheme!;
    }
    else if (options.scheme instanceof PlottedScheme) {
      this._scheme = options.scheme;
    }
    else {
      this._scheme = new PlottedScheme(options.scheme);
    }

    if (options.smaple instanceof SmapledPlottedProperty) {
      this._smaple = options.smaple;
    }
    else {
      this._smaple = new SmapledPlottedProperty(options.smaple);
    }
  }

  id: string;

  /**
   * @internal
   */
  private _scheme: PlottedScheme;

  get scheme(): PlottedScheme {
    return this._scheme;
  }

  /**
   * @internal
   */
  private _status: PlottedStatus = PlottedStatus.DEFINING;

  get status(): PlottedStatus {
    return this._status;
  }

  /**
   * @internal
   */
  private _statusChanged = new Event();

  get statusChanged(): Event {
    return this._statusChanged;
  }

  /**
   * @internal
   */
  setStatus(value: PlottedStatus) {
    const prev = this._status;
    this._status = value;
    if (prev !== value) {
      this.statusChanged.raiseEvent();
    }
  }

  /**
   * @internal
   */
  private _smaple: SmapledPlottedProperty;

  get smaple(): SmapledPlottedProperty {
    return this._smaple;
  }

  /**
   * @internal
   */
  _entities: Entity[] = [];

  get entities(): Entity[] {
    return [...this._entities];
  }

  /**
   * @internal
   */
  _primitives: any[] = [];

  get primitives(): any[] {
    return [...this._primitives];
  }
}
