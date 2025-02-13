import type { MaybeComputedElementRef } from '@vueuse/core';
import type { EffectScope, InjectionKey, MaybeRefOrGetter, ShallowRef } from 'vue';
import { tryOnScopeDispose, useMutationObserver } from '@vueuse/core';
import { Viewer } from 'cesium';
import { computed, getCurrentScope, markRaw, provide, shallowReadonly, shallowRef, toRaw, toValue, watchEffect } from 'vue';

/**
 * @internal
 */
export const CREATE_VIEWER_INJECTION_KEY: InjectionKey<Readonly<ShallowRef<Viewer | undefined>>> = Symbol('CREATE_VIEWER_INJECTION_KEY');

/**
 * @internal
 */
export const CREATE_VIEWER_COLLECTION = new WeakMap<EffectScope, Readonly<ShallowRef<Viewer | undefined>>>();

/**
 * Pass in an existing Viewer instance,
 * which can be accessed by the current component and its descendant components using {@link useViewer}
 *
 * When the Viewer instance referenced by this overloaded function becomes invalid, it will not trigger destruction.
 */
export function createViewer(
  viewer: MaybeRefOrGetter<Viewer | undefined>,
): Readonly<ShallowRef<Viewer | undefined>>;

/**
 * Initialize a Viewer instance, which can be accessed by the
 * current component and its descendant components using {@link useViewer}.
 *
 * The Viewer instance created by this overloaded function will automatically be destroyed when it becomes invalid.
 *
 * @param element - The DOM element or ID that will contain the widget
 * @param options - @see {Viewer.ConstructorOptions}
 */
export function createViewer(
  element?: MaybeComputedElementRef,
  options?: Viewer.ConstructorOptions,
): Readonly<ShallowRef<Viewer | undefined>>;

export function createViewer(...args: any) {
  const viewer = shallowRef<Viewer>();
  const readonlyViewer = shallowReadonly(viewer);

  provide(CREATE_VIEWER_INJECTION_KEY, readonlyViewer);

  const scope = getCurrentScope();
  if (scope) {
    CREATE_VIEWER_COLLECTION.set(scope, readonlyViewer);
  }

  const canvas = computed(() => viewer.value?.canvas);

  // Watch for the canvas being removed from the DOM
  useMutationObserver(document?.body, () => {
    if (canvas.value && !document?.body.contains(canvas.value)) {
      viewer.value = undefined;
    }
  }, {
    childList: true,
    subtree: true,
  });

  watchEffect((onCleanup) => {
    const [arg1, arg2] = args;
    const value = toRaw(toValue(arg1));
    if (value instanceof Viewer) {
      viewer.value = markRaw(value);
    }
    else if (value) {
      const element = value;
      const options = arg2;
      viewer.value = new Viewer(element, options);
      onCleanup(() => !viewer.value?.isDestroyed() && viewer.value?.destroy());
    }
    else {
      viewer.value = undefined;
    }
  });

  tryOnScopeDispose(() => {
    viewer.value = undefined;
  });

  return computed(() => {
    return viewer.value?.isDestroyed() ? undefined : viewer.value;
  });
}
