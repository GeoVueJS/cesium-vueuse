/**
 * Analyze the result of Cesium's `scene.pick` and convert it to an array format
 */
export function resolvePick(pick: any = {}): any[] {
  const { primitive, id, primitiveCollection, collection } = pick;
  const entityCollection = (id && id.entityCollection) || null;
  const dataSource = (entityCollection && entityCollection.owner) || null;
  const ids = Array.isArray(id) ? id : [id].filter(Boolean); // When aggregating entities, ensure id is an array and filter out falsy values
  return [
    ...ids,
    primitive,
    primitiveCollection,
    collection,
    entityCollection,
    dataSource,
  ].filter(e => !!e);
}

/**
 * Determine if the given array of graphics is hit by Cesium's `scene.pick`
 *
 * @param pick The `scene.pick` object used for matching
 * @param graphic An array of graphics to check for hits
 */
export function pickHitGraphic(pick: any, graphic: any | any[]): boolean {
  if (!Array.isArray(graphic) || !graphic.length) {
    return false;
  }
  const elements = resolvePick(pick);
  if (!elements.length) {
    return false;
  }
  return elements.some(element => graphic.includes(element));
}
