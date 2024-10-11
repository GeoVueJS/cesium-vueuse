import type { GraphicsEventType, GraphicsHandlerCallback, GraphicsPositiondEventType } from './types';
import { KeyboardEventModifier, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import { watchEffect } from 'vue';
import { useViewer } from '../useViewer';
import { createDragBind, createHoverBind, createPositiondBind } from './bind';

export interface UseGraphicsEventHandlerReturn<T extends GraphicsEventType> {
  add: (listener: GraphicsHandlerCallback<T>) => () => boolean;
  remove: (listener: GraphicsHandlerCallback<T>) => boolean;
}

export function useGraphicsEventHandler2() {
  const viewer = useViewer();
}
/**
 * 便捷的监听鼠标在图形上的操作事件，在组件卸载时自动移除所有事件监听
 */
export function useGraphicsEventHandler<T extends GraphicsEventType>(): UseGraphicsEventHandlerReturn<T> {
  const viewer = useViewer();
  const listeners = new Set<GraphicsHandlerCallback<T>>();

  const callback = (ctx: any) => {
    listeners.forEach((fn) => {
      try {
        fn(ctx);
      }
      catch (error) {
        console.error(error);
      }
    });
  };
  watchEffect((onCleanup) => {
    const _viewer = viewer.value;
    if (!_viewer) {
      return;
    }
    const handler = new ScreenSpaceEventHandler(viewer.value.canvas);
    onCleanup(() => handler.destroy());

    const modifier = [undefined, ...Object.values(KeyboardEventModifier)] as (KeyboardEventModifier | undefined)[];
    modifier.forEach((modifier) => {
      const positiondBind = createPositiondBind(_viewer, modifier, callback as GraphicsHandlerCallback<GraphicsPositiondEventType>);
      const dragBind = createDragBind(_viewer, modifier, callback as GraphicsHandlerCallback<'DRAG'>);
      const hoverBind = createHoverBind(_viewer, modifier, callback as GraphicsHandlerCallback<'HOVER'>);
      Object.values(ScreenSpaceEventType).forEach((type) => {
        type = type as ScreenSpaceEventType;
        handler.setInputAction(
          (context: any) => {
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
