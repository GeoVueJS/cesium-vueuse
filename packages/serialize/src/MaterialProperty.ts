import type { JulianDate } from 'cesium';

import { isHasValue, toPropertyValue } from '@cesium-vueuse/shared';
import { CheckerboardMaterialProperty, ColorMaterialProperty, GridMaterialProperty, ImageMaterialProperty, MaterialProperty, PolylineArrowMaterialProperty, PolylineDashMaterialProperty, PolylineGlowMaterialProperty, PolylineOutlineMaterialProperty, StripeMaterialProperty } from 'cesium';
import { Cartesian2Serialize } from './Cartesian2';
import { ColorSerialize } from './Color';
/**
 * `MaterialProperty`相关类型的序列化程序
 */
export interface MaterialPropertyProgram<T extends MaterialProperty = any> {
  programName: string;
  predicate: (materialProperty: T) => boolean;
  toJSON: (instance?: T, time?: JulianDate) => Record<string, any> ;
  fromJSON: (content?: Record<string, any>) => T | undefined;
}

export interface MaterialPropertyJSON {
  name: string;
  content: Record<string, any>;
}

/**
 * Serialize a `MaterialProperty` instance to JSON and deserialize from JSON
 */
export class MaterialPropertySerialize {
  private constructor() {}

  /**
   * @internal
   */
  private static _programs = new Map<string, any>();

  static getProgram(programName: string) {
    this._programs.get(programName);
  }

  /**
   * 设置指定程序
   */
  static setProgram(program: MaterialPropertyProgram) {
    this._programs.set(program.programName, program);
  }

  /**
   * 删除指定的序列化程序
   */
  static removeProgram(programName: string) {
    this._programs.delete(programName);
  }

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is MaterialProperty {
    return value instanceof MaterialProperty;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: MaterialProperty): MaterialPropertyJSON | undefined {
    if (!isHasValue(instance)) {
      return undefined;
    }
    const program = [...this._programs.values()].find(item => item.predicate(instance));
    if (program) {
      return {
        name: program.programName,
        content: program.toJSON(instance),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   */
  static fromJSON(json?: MaterialPropertyJSON): MaterialProperty | undefined {
    if (!isHasValue(json)) {
      return undefined;
    }
    const program = [...this._programs.values()].find(item => item.programName === json.name);
    if (program) {
      return program.fromJSON(json.content);
    }
  }
}

/**
 * preset `CheckerboardMaterialProperty` serialize program
 */
MaterialPropertySerialize.setProgram({
  programName: 'CheckerboardMaterialProperty',
  predicate: materialProperty => materialProperty instanceof CheckerboardMaterialProperty,
  toJSON(instance, time) {
    return {
      evenColor: ColorSerialize.toJSON(toPropertyValue(instance.evenColor, time)),
      oddColor: ColorSerialize.toJSON(toPropertyValue(instance.oddColor, time)),
      repeat: Cartesian2Serialize.toJSON(toPropertyValue(instance.repeat, time)),
    };
  },
  fromJSON(content) {
    return new CheckerboardMaterialProperty({
      evenColor: ColorSerialize.fromJSON(content?.evenColor),
      oddColor: ColorSerialize.fromJSON(content?.oddColor),
      repeat: Cartesian2Serialize.fromJSON(content?.repeat),
    });
  },
});

/**
 * preset `ColorMaterialProperty` serialize program
 */
MaterialPropertySerialize.setProgram({
  programName: 'ColorMaterialProperty',
  predicate: materialProperty => materialProperty instanceof ColorMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
    };
  },
  fromJSON(content) {
    return new ColorMaterialProperty(ColorSerialize.fromJSON(content?.color));
  },
});

/**
 * preset `GridMaterialProperty` serialize program
 */
MaterialPropertySerialize.setProgram({
  programName: 'GridMaterialProperty',
  predicate: materialProperty => materialProperty instanceof GridMaterialProperty,
  toJSON(instance, time) {
    return {
      cellAlpha: toPropertyValue(instance.cellAlpha, time),
      lineCount: Cartesian2Serialize.toJSON(toPropertyValue(instance.lineCount, time)),
      lineThickness: Cartesian2Serialize.toJSON(toPropertyValue(instance.lineThickness, time)),
      lineOffset: Cartesian2Serialize.toJSON(toPropertyValue(instance.lineOffset, time)),
      color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
    };
  },
  fromJSON(content) {
    return new GridMaterialProperty({
      color: ColorSerialize.fromJSON(content?.color),
      cellAlpha: content?.cellAlpha,
      lineCount: Cartesian2Serialize.fromJSON(content?.lineCount),
      lineThickness: Cartesian2Serialize.fromJSON(content?.lineThickness),
      lineOffset: Cartesian2Serialize.fromJSON(content?.lineOffset),
    });
  },
});

/**
 * preset `ImageMaterialProperty` serialize program
 */
MaterialPropertySerialize.setProgram({
  programName: 'ImageMaterialProperty',
  predicate: materialProperty => materialProperty instanceof ImageMaterialProperty,
  toJSON(instance, time) {
    return {
      image: toPropertyValue(instance.image, time),
      repeat: Cartesian2Serialize.toJSON(toPropertyValue(instance.repeat, time)),
      color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
      transparent: toPropertyValue(instance.transparent, time),
    };
  },
  fromJSON(content) {
    return new ImageMaterialProperty({
      image: content?.image,
      repeat: Cartesian2Serialize.fromJSON(content?.repeat),
      color: ColorSerialize.fromJSON(content?.color),
      transparent: content?.transparent,
    });
  },
});

/**
 * preset `PolylineArrowMaterialProperty` serialize program
 */
MaterialPropertySerialize.setProgram({
  programName: 'PolylineArrowMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineArrowMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
    };
  },
  fromJSON(content) {
    return new PolylineArrowMaterialProperty(ColorSerialize.fromJSON(content?.color));
  },
});

/**
 * preset `PolylineDashMaterialProperty` serialize program
 */
MaterialPropertySerialize.setProgram({
  programName: 'PolylineDashMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineDashMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
      gapColor: ColorSerialize.toJSON(toPropertyValue(instance.gapColor, time)),
      dashLength: toPropertyValue(instance.dashLength, time),
      dashPattern: toPropertyValue(instance.dashPattern, time),
    };
  },
  fromJSON(content) {
    return new PolylineDashMaterialProperty({
      color: ColorSerialize.fromJSON(content?.color),
      gapColor: ColorSerialize.fromJSON(content?.gapColor),
      dashLength: content?.dashLength,
      dashPattern: content?.dashPattern,
    });
  },
});

/**
 * preset `PolylineGlowMaterialProperty` serialize program
 */
MaterialPropertySerialize.setProgram({
  programName: 'PolylineGlowMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineGlowMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
      glowPower: toPropertyValue(instance.glowPower, time),
      taperPower: toPropertyValue(instance.taperPower, time),
    };
  },
  fromJSON(content) {
    return new PolylineGlowMaterialProperty({
      color: ColorSerialize.fromJSON(content?.color),
      glowPower: content?.glowPower,
      taperPower: content?.taperPower,
    });
  },
});

/**
 * preset `StripeMaterialProperty` serialize program
 */
MaterialPropertySerialize.setProgram({
  programName: 'StripeMaterialProperty',
  predicate: materialProperty => materialProperty instanceof StripeMaterialProperty,
  toJSON(instance, time) {
    return {
      orientation: toPropertyValue(instance.orientation, time),
      evenColor: ColorSerialize.toJSON(toPropertyValue(instance.evenColor, time)),
      oddColor: ColorSerialize.toJSON(toPropertyValue(instance.oddColor, time)),
      offset: toPropertyValue(instance.offset, time),
      repeat: toPropertyValue(instance.repeat, time),
    };
  },
  fromJSON(content) {
    return new StripeMaterialProperty({
      orientation: content?.orientation,
      evenColor: ColorSerialize.fromJSON(content?.evenColor),
      oddColor: ColorSerialize.fromJSON(content?.oddColor),
      offset: content?.offset,
      repeat: content?.repeat,
    });
  },
});

/**
 * preset `PolylineOutlineMaterialProperty` serialize program
 */
MaterialPropertySerialize.setProgram({
  programName: 'PolylineOutlineMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineOutlineMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
      outlineColor: ColorSerialize.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
    };
  },
  fromJSON(content) {
    return new PolylineOutlineMaterialProperty({
      color: ColorSerialize.fromJSON(content?.color),
      outlineColor: ColorSerialize.fromJSON(content?.outlineColor),
      outlineWidth: content?.outlineWidth,
    });
  },
});
