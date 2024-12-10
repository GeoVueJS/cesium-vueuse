import type { PlottedSchemeConstructorOptions } from './plotted-scheme';
import type { SmapledPlottedPropertyConstructorOptions } from './smapled-plotted-property';
import { PlottedScheme } from './plotted-scheme';
import { SmapledPlottedProperty } from './smapled-plotted-property';

export interface PlottedConstructorOptions {
  uuid?: string;
  scheme: string | PlottedScheme | PlottedSchemeConstructorOptions;
  smaple?: SmapledPlottedProperty | SmapledPlottedPropertyConstructorOptions;
  config?: any;
}

export class Plotted {
  constructor(options: PlottedConstructorOptions) {
    if (typeof options.scheme === 'string') {
      const scheme = PlottedScheme.getRecord(options.scheme);
      if (!scheme) {
        throw new Error(`scheme ${options.scheme} not found`);
      }
      this._scheme = scheme;
    }
    else {
      this._scheme = options.scheme instanceof PlottedScheme ? options.scheme : new PlottedScheme(options.scheme);
    }

    this._smapled = options.smapled instanceof SmapledPlottedProperty ? options.smapled : new SmapledPlottedProperty(options.smapled);
  }

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
  private _smapled: SmapledPlottedProperty;

  get smapled(): SmapledPlottedProperty {
    return this._smapled;
  }
}
