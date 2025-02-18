import type { ShallowReactive } from 'vue';
import { isPromise } from '@vesium/shared';
import { tryOnScopeDispose } from '@vueuse/core';
import { shallowReactive, shallowReadonly } from 'vue';

export type EffcetRemovePredicate<T> = (instance: T) => boolean;

export interface UseCollectionScopeReturn<
  isPromise extends boolean,
  T,
  AddArgs extends any[],
  RemoveArgs extends any[],
  RemoveReturn = any,
> {
  /**
   * A `Set` for storing SideEffect instance,
   * which is encapsulated using `ShallowReactive` to provide Vue's reactive functionality
   */
  scope: Readonly<ShallowReactive<Set<T>>>;

  /**
   * Add SideEffect instance
   */
  add: (i: T, ...args: AddArgs) => isPromise extends true ? Promise<T> : T;

  /**
   * Remove specified SideEffect instance
   */
  remove: (i: T, ...args: RemoveArgs) => RemoveReturn;

  /**
   * Remove all SideEffect instance that meets the specified criteria
   */
  removeWhere: (predicate: EffcetRemovePredicate<T>, ...args: RemoveArgs) => void;

  /**
   * Remove all SideEffect instance within current scope
   */
  removeScope: (...args: RemoveArgs) => void;
}

/**
 * Scope the SideEffects of Cesium-related `Collection` and automatically remove them on unmounted
 * - note: This is a basic function that is intended to be called by other lower-level function
 * @param addFn - add SideEffect function.  eg.`entites.add`
 * @param removeFn - Clean SideEffect function.  eg.`entities.remove`
 * @param removeScopeArgs - The parameters to pass for `removeScope` triggered when the component is unmounted
 */
export function useCollectionScope<
  isPromise extends boolean,
  T = any,
  AddArgs extends any[] = any[],
  RemoveArgs extends any[] = any[],
  RemoveReturn = any,
>(
  addFn: (i: T, ...args: AddArgs) => isPromise extends true ? Promise<T> : T,
  removeFn: (i: T, ...args: RemoveArgs) => RemoveReturn,
  removeScopeArgs: RemoveArgs,
): UseCollectionScopeReturn<isPromise, T, AddArgs, RemoveArgs, RemoveReturn> {
  const scope = shallowReactive(new Set<T>());

  const add: any = (instance: T, ...args: AddArgs) => {
    const result = addFn(instance, ...args);
    // 可能为promise 如dataSource
    if (isPromise(result)) {
      return new Promise<T>((resolve, reject) => {
        result.then((i) => {
          scope.add(i);
          resolve(i);
        }).catch(error => reject(error));
      });
    }
    else {
      scope.add(result as T);
      return result;
    }
  };

  const remove = (instance: T, ...args: RemoveArgs) => {
    scope.delete(instance);
    return removeFn(instance, ...args);
  };

  const removeWhere = (predicate: EffcetRemovePredicate<T>, ...args: RemoveArgs) => {
    scope.forEach((instance) => {
      if (predicate(instance)) {
        remove(instance, ...args);
      }
    });
  };

  const removeScope = (...args: RemoveArgs) => {
    scope.forEach((instance) => {
      remove(instance, ...args);
    });
  };

  tryOnScopeDispose(() => removeScope(...removeScopeArgs));

  return {
    scope: shallowReadonly(scope),
    add,
    remove,
    removeWhere,
    removeScope,
  };
}
