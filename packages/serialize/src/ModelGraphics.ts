import type { JulianDate, Resource } from 'cesium';
import type { Cartesian2JSON } from './Cartesian2';
import type { ClippingPlaneCollectionJSON } from './ClippingPlaneCollection';
import type { ColorJSON } from './Color';
import type { ColorBlendModeJSON } from './ColorBlendMode';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { PropertyBagJSON } from './PropertyBag';
import type { ShadowModeJSON } from './ShadowMode';
import { toPropertyValue } from '@vesium/shared';
import { notNullish } from '@vueuse/core';
import { ModelGraphics } from 'cesium';
import { Cartesian2Serialize } from './Cartesian2';
import { ClippingPlaneCollectionSerialize } from './ClippingPlaneCollection';
import { ColorSerialize } from './Color';
import { ColorBlendModeSerialize } from './ColorBlendMode';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { PropertyBagSerialize } from './PropertyBag';

import { ShadowModeSerialize } from './ShadowMode';

export interface ModelGraphicsJSON {
  show?: boolean;
  uri?: string | Resource;
  scale?: number;
  enableVerticalExaggeration?: boolean;
  minimumPixelSize?: number;
  maximumScale?: number;
  incrementallyLoadTextures?: boolean;
  runAnimations?: boolean;
  clampAnimations?: boolean;
  shadows?: ShadowModeJSON;
  heightReference?: HeightReferenceJSON;
  silhouetteColor?: ColorJSON;
  silhouetteSize?: number;
  color?: ColorJSON;
  colorBlendMode?: ColorBlendModeJSON;
  colorBlendAmount?: number;
  imageBasedLightingFactor?: Cartesian2JSON;
  lightColor?: ColorJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
  nodeTransformations?: PropertyBagJSON;
  articulations?: PropertyBagJSON;
  clippingPlanes?: ClippingPlaneCollectionJSON;
  // customShader?: CustomShaderJSON;
}

/**
 * Serialize a `ModelGraphics` instance to JSON and deserialize from JSON
 */
export class ModelGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is ModelGraphics {
    return value instanceof ModelGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ModelGraphics, time?: JulianDate): ModelGraphicsJSON | undefined {
    if (notNullish(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        uri: toPropertyValue(instance.uri, time),
        scale: toPropertyValue(instance.scale, time),
        enableVerticalExaggeration: toPropertyValue(instance.enableVerticalExaggeration, time),
        minimumPixelSize: toPropertyValue(instance.minimumPixelSize, time),
        maximumScale: toPropertyValue(instance.maximumScale, time),
        incrementallyLoadTextures: toPropertyValue(instance.incrementallyLoadTextures, time),
        runAnimations: toPropertyValue(instance.runAnimations, time),
        clampAnimations: toPropertyValue(instance.clampAnimations, time),
        shadows: ShadowModeSerialize.toJSON(toPropertyValue(instance.shadows, time)),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        silhouetteColor: ColorSerialize.toJSON(toPropertyValue(instance.silhouetteColor, time)),
        silhouetteSize: toPropertyValue(instance.silhouetteSize, time),
        color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
        colorBlendMode: ColorBlendModeSerialize.toJSON(toPropertyValue(instance.colorBlendMode, time)),
        colorBlendAmount: toPropertyValue(instance.colorBlendAmount, time),
        imageBasedLightingFactor: Cartesian2Serialize.toJSON(toPropertyValue(instance.imageBasedLightingFactor, time)),
        lightColor: ColorSerialize.toJSON(toPropertyValue(instance.lightColor, time)),
        distanceDisplayCondition: DistanceDisplayConditionSerialize.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
        nodeTransformations: PropertyBagSerialize.toJSON(toPropertyValue(instance.nodeTransformations, time)),
        articulations: PropertyBagSerialize.toJSON(toPropertyValue(instance.articulations, time)),
        clippingPlanes: ClippingPlaneCollectionSerialize.toJSON(toPropertyValue(instance.clippingPlanes, time)),
        // customShader: CustomShaderSerialize.toJSON(toPropertyValue(instance.customShader, time)),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: ModelGraphicsJSON, result?: ModelGraphics): ModelGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new ModelGraphics({
      show: json.show,
      uri: json.uri,
      scale: json.scale,
      enableVerticalExaggeration: json.enableVerticalExaggeration,
      minimumPixelSize: json.minimumPixelSize,
      maximumScale: json.maximumScale,
      incrementallyLoadTextures: json.incrementallyLoadTextures,
      runAnimations: json.runAnimations,
      clampAnimations: json.clampAnimations,
      shadows: ShadowModeSerialize.fromJSON(json.shadows),
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      silhouetteColor: ColorSerialize.fromJSON(json.silhouetteColor),
      silhouetteSize: json.silhouetteSize,
      color: ColorSerialize.fromJSON(json.color),
      colorBlendMode: ColorBlendModeSerialize.fromJSON(json.colorBlendMode),
      colorBlendAmount: json.colorBlendAmount,
      imageBasedLightingFactor: Cartesian2Serialize.fromJSON(json.imageBasedLightingFactor),
      lightColor: ColorSerialize.fromJSON(json.lightColor),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
      nodeTransformations: PropertyBagSerialize.fromJSON(json.nodeTransformations),
      articulations: PropertyBagSerialize.fromJSON(json.articulations),
      clippingPlanes: ClippingPlaneCollectionSerialize.fromJSON(json.clippingPlanes),
      // customShader: CustomShaderSerialize.fromJSON(json.customShader),
    });
    return result ? instance.clone(result) : instance;
  }
}
