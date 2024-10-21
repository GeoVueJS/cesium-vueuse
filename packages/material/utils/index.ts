import type { CesiumMaterial, CesiumMaterialConstructorOptions } from '../types';
import { Material } from 'cesium';

/**
 * Get material from cache, alias of `Material._materialCache.getMaterial`
 */
export function getMaterialCache<T extends Material = CesiumMaterial<any>>(type: string): T | undefined {
  return (Material as any)._materialCache.getMaterial(type);
}

/**
 * Add material to Cesium's material cache, alias of `Material._materialCache.addMaterial`
 */
export function addMaterialCache(type: string, material: CesiumMaterialConstructorOptions<any>): void {
  return (Material as any)._materialCache.addMaterial(type, material);
}
