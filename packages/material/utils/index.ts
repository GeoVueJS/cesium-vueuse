import type { CesiumMaterial, CesiumMaterialConstructorOptions } from '../types';
import { Material } from 'cesium';

export function getMaterialCache<T extends Material = CesiumMaterial<any>>(type: string): T | undefined {
  return (Material as any)._materialCache.getMaterial(type);
}

export function addMaterialCache(type: string, material: CesiumMaterialConstructorOptions<any>): void {
  return (Material as any)._materialCache.addMaterial(type, material);
}
