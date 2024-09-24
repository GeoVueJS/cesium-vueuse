import type { Viewer } from 'cesium';
import type { ShallowRef } from 'vue';
import { getCurrentInstance, inject } from 'vue';
import { CREATE_VIEWER_COLLECTION, CREATE_VIEWER_INJECTION_KEY } from '../createViewer';

/**
 * Obtain the `Viewer` instance injected through `createViewer` in the current component or its ancestor components.
 *
 * note:
 * - If `createViewer` and `useViewer` are called in the same component, the `Viewer` instance injected by `createViewer` will be used preferentially.
 * - When calling `createViewer` and `useViewer` in the same component, `createViewer` should be called before `useViewer`.
 */
export function useViewer(): Readonly<ShallowRef<Viewer | undefined>> {
  const instance = getCurrentInstance();
  const instanceViewer = instance ? CREATE_VIEWER_COLLECTION.get(instance) : undefined;
  if (instanceViewer) {
    return instanceViewer;
  }
  else {
    const injectViewer = inject(CREATE_VIEWER_INJECTION_KEY);
    if (!injectViewer) {
      throw new Error('The `Viewer` instance injected by `createViewer` was not found in the current component or its ancestor components. Have you called `createViewer`?');
    }
    return injectViewer;
  }
}
