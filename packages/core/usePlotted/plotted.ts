import type { PlottedSchemeConstructorOptions } from './plotted-scheme';
import type { SmapledPositionsPropertyConstructorOptions } from './smapled-positions-property';
import { PlottedScheme } from './plotted-scheme';
import { SmapledPositionsProperty } from './smapled-positions-property';

export interface PlottedConstructorOptions {
  uuid?: string;
  scheme: string | PlottedScheme | PlottedSchemeConstructorOptions;
  smaple?: SmapledPositionsProperty | SmapledPositionsPropertyConstructorOptions;
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

    this._smaple = options.smaple instanceof SmapledPositionsProperty ? options.smaple : new SmapledPositionsProperty(options.smaple);
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
  private _smaple: SmapledPositionsProperty;

  get smaple(): SmapledPositionsProperty {
    return this._smaple;
  }
}
