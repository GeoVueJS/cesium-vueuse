import { Entity } from 'cesium';

export function toEntity<T extends Entity = Entity>(entity: T | Entity.ConstructorOptions): T;

export function toEntity<T extends Entity >(entity: T | Entity.ConstructorOptions | undefined | null): T | null;

export function toEntity<T extends Entity>(
  entityOrOptions?: T | Entity.ConstructorOptions | null | undefined,
) {
  return entityOrOptions instanceof Entity
    ? entityOrOptions
    : entityOrOptions
      ? new Entity(entityOrOptions)
      : null;
}
