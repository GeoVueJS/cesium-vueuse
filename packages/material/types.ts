import type { Event, JulianDate, MaterialProperty, TextureMagnificationFilter, TextureMinificationFilter } from 'cesium';
import { Material } from 'cesium';

/**
 * Cesium.Material.fabric参数
 */
export interface CesiumMaterialFabricOptions<U> {
  /**
   * 用于声明 fabric 对象最终会生成什么材质，如果是官方内置的，直接用官方内置的，否则则创建自定义的材质并缓存。
   */
  type: string;
  /**
   * 可再塞进去一层子级的 fabric，构成复合材质
   */
  materials?: Material;
  /**
   * glsl代码
   */
  source?: string;
  components?: {
    diffuse?: string;
    alpha?: string;
  };
  /**
   * 传glsl代码的变量
   */
  uniforms?: U & Record<string, any>;
}

/**
 * Cesium.Material参数
 */
export interface CesiumMaterialConstructorOptions<U> {
  /**
   * 严格模式
   */
  strict?: boolean;
  /**
   * translucent
   */
  translucent?: boolean | ((...params: any[]) => any);
  /**
   * 缩小滤镜
   */
  minificationFilter?: TextureMinificationFilter;
  /**
   * 放大滤镜
   */
  magnificationFilter?: TextureMagnificationFilter;
  /**
   * 矩阵配置
   */
  fabric: CesiumMaterialFabricOptions<U>;
}

/**
 * 仅作为`Cesium.Material`的类型修复
 */
export class CesiumMaterial<U> extends Material {
  constructor(options: CesiumMaterialConstructorOptions<U>) {
    super(options);
  }

  /**
   * 矩阵配置
   */
  declare fabric: CesiumMaterialFabricOptions<U>;
}

/**
 * 仅作为`Cesium.MaterialProperty`的类型修复
 */
export interface CesiumMaterialProperty<V> extends MaterialProperty {
  get isConstant(): boolean;

  get definitionChanged(): Event<(scope: this, field: string, value: any, previous: any) => void>;

  getType: (time: JulianDate) => string;

  getValue: (time: JulianDate, result?: V) => V;

  equals: (other?: any) => boolean;
}
