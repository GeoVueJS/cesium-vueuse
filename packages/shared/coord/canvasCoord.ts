import { Ellipsoid } from 'cesium';

import type { Cartesian2, Cartesian3, Scene } from 'cesium';

/**
 * 将画布坐标转换为笛卡尔坐标
 *
 * @param canvasCoord 画布坐标
 * @param scene 场景
 * @param mode 模式，可选值为 'pickPosition' | 'globePick' | 'auto' | 'noHeight'，默认为 'auto'
 *
 *
 * pickPosition：使用scene.pickPosition进行转换，可贴模型、倾斜摄影等进行拾取。
 * 但如果未开启深度监测(globe.depthTestAgainstTerrain=false)则贴地形拾取或出现不准确的问题
 *
 * globePick：使用camera.getPickRay 进行转换，不可贴模型倾斜摄影拾取，但可以贴地形拾取，如果不存在地形，则拾取的高程为0
 *
 * auto：自动进行判断返回何种拾取内容
 *
 * 计算速度对比  globePick \> auto \>= pickPosition
 * @returns 笛卡尔坐标，如果转换失败则返回 undefined
 */
export function canvasCoordToCartesian(
  canvasCoord: Cartesian2,
  scene: Scene,
  mode: 'pickPosition' | 'globePick' | 'auto' = 'auto',
): Cartesian3 | undefined {
  if (mode === 'pickPosition') {
    return scene.pickPosition(canvasCoord);
  }
  else if (mode === 'globePick') {
    const ray = scene.camera.getPickRay(canvasCoord);
    return ray && scene.globe.pick(ray, scene);
  }
  else {
    // 深度监测
    if (scene.globe.depthTestAgainstTerrain) {
      return scene.pickPosition(canvasCoord);
    }
    const position1 = scene.pickPosition(canvasCoord);
    const ray = scene.camera.getPickRay(canvasCoord);
    const position2 = ray && scene.globe.pick(ray, scene);
    if (!position1) {
      return position2;
    }
    const height1 = (position1 && Ellipsoid.WGS84.cartesianToCartographic(position1).height) ?? 0;
    const height2 = (position2 && Ellipsoid.WGS84.cartesianToCartographic(position2).height) ?? 0;
    return height1 < height2 ? position1 : position2;
  }
}

/**
 * 将笛卡尔坐标转换为画布坐标
 *
 * @param position 笛卡尔坐标
 * @param scene 场景对象
 * @returns 画布坐标
 */
export function cartesianToCanvasCoord(position: Cartesian3, scene: Scene): Cartesian2 {
  return scene.cartesianToCanvasCoordinates(position);
}
