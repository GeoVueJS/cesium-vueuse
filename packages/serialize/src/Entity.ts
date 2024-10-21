import type { JulianDate } from 'cesium';
import type { BillboardGraphicsJSON } from './BillboardGraphics';

import type { BoxGraphicsJSON } from './BoxGraphics';
import type { Cartesian3JSON } from './Cartesian3';
import type { Cesium3DTilesetGraphicsJSON } from './Cesium3DTilesetGraphics';
import type { CorridorGraphicsJSON } from './CorridorGraphics';
import type { CylinderGraphicsJSON } from './CylinderGraphics';
import type { EllipseGraphicsJSON } from './EllipseGraphics';
import type { EllipsoidGraphicsJSON } from './EllipsoidGraphics';
import type { LabelGraphicsJSON } from './LabelGraphics';
import type { ModelGraphicsJSON } from './ModelGraphics';
import type { PathGraphicsJSON } from './PathGraphics';
import type { PlaneGraphicsJSON } from './PlaneGraphics';
import type { PointGraphicsJSON } from './PointGraphics';
import type { PolygonGraphicsJSON } from './PolygonGraphics';
import type { PolylineGraphicsJSON } from './PolylineGraphics';
import type { PolylineVolumeGraphicsJSON } from './PolylineVolumeGraphics';
import type { PositionPropertyJSON } from './PositionProperty';
import type { PropertyBagJSON } from './PropertyBag';
import type { QuaternionJSON } from './Quaternion';
import type { RectangleGraphicsJSON } from './RectangleGraphics';
import type { TimeIntervalCollectionJSON } from './TimeIntervalCollection';
import type { WallGraphicsJSON } from './WallGraphics';
import { isHasValue, toPropertyValue } from '@cesium-vueuse/shared';
import { Entity } from 'cesium';
import { BillboardGraphicsSerialize } from './BillboardGraphics';
import { BoxGraphicsSerialize } from './BoxGraphics';
import { Cartesian3Serialize } from './Cartesian3';
import { Cesium3DTilesetGraphicsSerialize } from './Cesium3DTilesetGraphics';
import { CorridorGraphicsSerialize } from './CorridorGraphics';
import { CylinderGraphicsSerialize } from './CylinderGraphics';
import { EllipseGraphicsSerialize } from './EllipseGraphics';
import { EllipsoidGraphicsSerialize } from './EllipsoidGraphics';
import { LabelGraphicsSerialize } from './LabelGraphics';
import { ModelGraphicsSerialize } from './ModelGraphics';
import { PathGraphicsSerialize } from './PathGraphics';
import { PlaneGraphicsSerialize } from './PlaneGraphics';
import { PointGraphicsSerialize } from './PointGraphics';
import { PolygonGraphicsSerialize } from './PolygonGraphics';
import { PolylineGraphicsSerialize } from './PolylineGraphics';
import { PolylineVolumeGraphicsSerialize } from './PolylineVolumeGraphics';
import { PositionPropertySerialize } from './PositionProperty';
import { PropertyBagSerialize } from './PropertyBag';
import { QuaternionSerialize } from './Quaternion';
import { RectangleGraphicsSerialize } from './RectangleGraphics';
import { TimeIntervalCollectionSerialize } from './TimeIntervalCollection';
import { WallGraphicsSerialize } from './WallGraphics';

export interface EntityJSON {
  id?: string;
  name?: string;
  availability?: TimeIntervalCollectionJSON;
  show?: boolean;
  description?: string;
  position?: PositionPropertyJSON;
  orientation?: QuaternionJSON;
  viewFrom?: Cartesian3JSON;
  parent?: string;
  billboard?: BillboardGraphicsJSON;
  box?: BoxGraphicsJSON;
  corridor?: CorridorGraphicsJSON;
  cylinder?: CylinderGraphicsJSON;
  ellipse?: EllipseGraphicsJSON;
  ellipsoid?: EllipsoidGraphicsJSON;
  label?: LabelGraphicsJSON;
  model?: ModelGraphicsJSON;
  tileset?: Cesium3DTilesetGraphicsJSON;
  path?: PathGraphicsJSON;
  plane?: PlaneGraphicsJSON;
  point?: PointGraphicsJSON;
  polygon?: PolygonGraphicsJSON;
  polyline?: PolylineGraphicsJSON;
  properties?: PropertyBagJSON;
  polylineVolume?: PolylineVolumeGraphicsJSON;
  rectangle?: RectangleGraphicsJSON;
  wall?: WallGraphicsJSON;
}

/**
 * Serialize a `Entity` instance to JSON and deserialize from JSON
 */
export class EntitySerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is Entity {
    return value instanceof Entity;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Entity, time?: JulianDate): EntityJSON | undefined {
    if (isHasValue(instance)) {
      return {
        id: instance.id,
        name: instance.name,
        availability: TimeIntervalCollectionSerialize.toJSON(instance.availability),
        show: !!instance.show,
        description: toPropertyValue(instance.description, time),
        position: PositionPropertySerialize.toJSON(instance.position),
        orientation: QuaternionSerialize.toJSON(toPropertyValue(instance.orientation, time)),
        viewFrom: Cartesian3Serialize.toJSON(toPropertyValue(instance.viewFrom, time)),
        billboard: BillboardGraphicsSerialize.toJSON(instance.billboard),
        box: BoxGraphicsSerialize.toJSON(instance.box),
        corridor: CorridorGraphicsSerialize.toJSON(instance.corridor),
        cylinder: CylinderGraphicsSerialize.toJSON(instance.cylinder),
        ellipse: EllipseGraphicsSerialize.toJSON(instance.ellipse),
        ellipsoid: EllipsoidGraphicsSerialize.toJSON(instance.ellipsoid),
        label: LabelGraphicsSerialize.toJSON(instance.label),
        model: ModelGraphicsSerialize.toJSON(instance.model),
        tileset: Cesium3DTilesetGraphicsSerialize.toJSON(instance.tileset),
        path: PathGraphicsSerialize.toJSON(instance.path),
        plane: PlaneGraphicsSerialize.toJSON(instance.plane),
        point: PointGraphicsSerialize.toJSON(instance.point),
        polygon: PolygonGraphicsSerialize.toJSON(instance.polygon),
        polyline: PolylineGraphicsSerialize.toJSON(instance.polyline),
        properties: PropertyBagSerialize.toJSON(instance.properties),
        polylineVolume: PolylineVolumeGraphicsSerialize.toJSON(instance.polylineVolume),
        rectangle: RectangleGraphicsSerialize.toJSON(instance.rectangle),
        wall: WallGraphicsSerialize.toJSON(instance.wall),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   */
  static fromJSON(json?: EntityJSON): Entity | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new Entity({
      id: json.id,
      name: json.name,
      availability: TimeIntervalCollectionSerialize.fromJSON(json.availability),
      show: !!json.show,
      description: json.description,
      position: PositionPropertySerialize.fromJSON(json.position),
      orientation: QuaternionSerialize.fromJSON((json.orientation)),
      viewFrom: Cartesian3Serialize.fromJSON(json.viewFrom),
      billboard: BillboardGraphicsSerialize.fromJSON(json.billboard),
      box: BoxGraphicsSerialize.fromJSON(json.box),
      corridor: CorridorGraphicsSerialize.fromJSON(json.corridor),
      cylinder: CylinderGraphicsSerialize.fromJSON(json.cylinder),
      ellipse: EllipseGraphicsSerialize.fromJSON(json.ellipse),
      ellipsoid: EllipsoidGraphicsSerialize.fromJSON(json.ellipsoid),
      label: LabelGraphicsSerialize.fromJSON(json.label),
      model: ModelGraphicsSerialize.fromJSON(json.model),
      tileset: Cesium3DTilesetGraphicsSerialize.fromJSON(json.tileset),
      path: PathGraphicsSerialize.fromJSON(json.path),
      plane: PlaneGraphicsSerialize.fromJSON(json.plane),
      point: PointGraphicsSerialize.fromJSON(json.point),
      polygon: PolygonGraphicsSerialize.fromJSON(json.polygon),
      polyline: PolylineGraphicsSerialize.fromJSON(json.polyline),
      properties: PropertyBagSerialize.fromJSON(json.properties),
      polylineVolume: PolylineVolumeGraphicsSerialize.fromJSON(json.polylineVolume),
      rectangle: RectangleGraphicsSerialize.fromJSON(json.rectangle),
      wall: WallGraphicsSerialize.fromJSON(json.wall),
    });
    return instance;
  }
}
