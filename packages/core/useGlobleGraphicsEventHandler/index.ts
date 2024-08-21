import { createSharedComposable } from '@vueuse/core';
import { KeyboardEventModifier, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import { watchEffect } from 'vue';

import { useViewer } from '../useViewer';

import { createDragBind, createHoverBind, createPositiondBind } from './bind';

import type { GraphicsEventType, GraphicsHandlerCallback, GraphicsPositiondEventType } from './types';

function _useGlobleGraphicsEventHandler<T extends GraphicsEventType>() {
  const viewer = useViewer();
  const listeners = new Set<GraphicsHandlerCallback<T>>();
  const callback = (...rest: any[]) => {
    listeners.forEach((fn) => {
      try {
        // @ts-expect-error rest params
        fn(...rest);
      }
      catch (error) {
        console.error(error);
      }
    });
  };
  watchEffect((onCleanup) => {
    if (!viewer.value) {
      return;
    }
    const handler = new ScreenSpaceEventHandler(viewer.value.canvas);
    onCleanup(() => handler.destroy());
    const modifier = [undefined, ...Object.values(KeyboardEventModifier)] as (KeyboardEventModifier | undefined)[];
    modifier.forEach((modifier) => {
      const positiondBind = createPositiondBind(viewer.value, modifier, callback as GraphicsHandlerCallback<GraphicsPositiondEventType>);
      const dragBind = createDragBind(viewer.value, modifier, callback as GraphicsHandlerCallback<'DRAG'>);
      const hoverBind = createHoverBind(viewer.value, modifier, callback as GraphicsHandlerCallback<'HOVER'>);
      Object.values(ScreenSpaceEventType).forEach((type) => {
        type = type as ScreenSpaceEventType;
        handler.setInputAction(
          (context) => {
            positiondBind(type, context);
            hoverBind(type, context);
            dragBind(type, context);
          },
          type,
          modifier,
        );
      });
    });
  });

  const remove = (listener: GraphicsHandlerCallback<T>) => {
    return listeners.delete(listener);
  };
  const add = (listener: GraphicsHandlerCallback<T>) => {
    listeners.add(listener);
    return () => remove(listener);
  };
  return {
    add,
    remove,
  };
}

export const useGlobleGraphicsEventHandler = createSharedComposable(_useGlobleGraphicsEventHandler);
