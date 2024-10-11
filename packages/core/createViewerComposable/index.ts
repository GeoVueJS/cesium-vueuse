import type { AnyFn } from '@cesium-vueuse/shared';
import type { Viewer } from 'cesium';
import type { EffectScope } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';
import { effectScope } from 'vue';
import { useViewer } from '../useViewer';

interface ViewerMapRecord<Fn extends AnyFn> {
  subscribers: number;
  state: ReturnType<Fn> | undefined;
};

/**
 * Make a composable function usable with multiple Vue instances.
 */

export function createViewerComposable<Fn extends AnyFn>(composable: Fn): Fn {
  const collection = new Map<Viewer, ViewerMapRecord<Fn>>();

  let subscribers = 0;
  let viewer: Viewer | undefined;
  let state: ReturnType<Fn> | undefined;
  let scope: EffectScope | undefined;

  const dispose = () => {
    subscribers -= 1;
    if (scope && subscribers <= 0) {
      scope.stop();
      state = undefined;
      scope = undefined;
    }
  };

  return <Fn>((...args) => {
    if (!scope) {
      const viewer = useViewer();
      scope = effectScope(true);
      state = scope.run(() => {
        return composable(...args);
      });
    }
    subscribers += 1;
    tryOnScopeDispose(dispose);
    return state;
  });
}
