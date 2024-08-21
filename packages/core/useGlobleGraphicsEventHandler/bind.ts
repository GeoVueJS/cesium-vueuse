import { throttle } from '@cesium-vueuse/shared';
import { ScreenSpaceEventType } from 'cesium';

import type { GraphicsHandlerCallback, GraphicsPositiondEventType } from './types';
import type { Cartesian2, KeyboardEventModifier, ScreenSpaceEventHandler, Viewer } from 'cesium';

const POSITIOND_EVENT_TYPE_MAP = {
  [ScreenSpaceEventType.LEFT_DOWN]: 'LEFT_DOWN',
  [ScreenSpaceEventType.LEFT_UP]: 'LEFT_UP',
  [ScreenSpaceEventType.LEFT_CLICK]: 'LEFT_CLICK',
  [ScreenSpaceEventType.LEFT_DOUBLE_CLICK]: 'LEFT_DOUBLE_CLICK',
  [ScreenSpaceEventType.RIGHT_DOWN]: 'RIGHT_DOWN',
  [ScreenSpaceEventType.RIGHT_UP]: 'RIGHT_UP',
  [ScreenSpaceEventType.RIGHT_CLICK]: 'RIGHT_CLICK',
  [ScreenSpaceEventType.MIDDLE_DOWN]: 'MIDDLE_DOWN',
  [ScreenSpaceEventType.MIDDLE_UP]: 'MIDDLE_UP',
  [ScreenSpaceEventType.MIDDLE_CLICK]: 'MIDDLE_CLICK',
};

/**
 * 创建单位置的鼠标绑定函数
 *
 * @param viewer 视图对象
 * @param modifier 键盘事件修饰符
 * @param callback 图形位置回调函数
 * @returns 绑定函数
 */
export function createPositiondBind(
  viewer: Viewer,
  modifier: KeyboardEventModifier | undefined,
  callback: GraphicsHandlerCallback<GraphicsPositiondEventType>,
) {
  return (type: ScreenSpaceEventType, context?: any) => {
    if (POSITIOND_EVENT_TYPE_MAP[type] && context) {
      const pick = viewer.scene.pick(context.position);
      pick && callback({
        type: POSITIOND_EVENT_TYPE_MAP[type],
        modifier,
        params: { scene: viewer.scene, context, pick },
      });
    }
  };
}

/**
 * 创建悬停绑定函数
 *
 * @param viewer 视图对象
 * @param modifier 键盘事件修饰符
 * @param callback 图形悬停回调函数
 * @returns 返回一个处理鼠标移动事件的函数
 */
export function createHoverBind(
  viewer: Viewer,
  modifier: KeyboardEventModifier | undefined,
  callback: GraphicsHandlerCallback<'HOVER'>,
) {
  let preHoverPick: any;
  let stopPrev: (() => void) | null;
  const listener = (context: ScreenSpaceEventHandler.MotionEvent) => {
    const pick = viewer.scene.pick(context.endPosition);
    // 告知前一次循环的hover事件已结束hover
    if (!pick || pick !== preHoverPick) {
      stopPrev?.();
      stopPrev = null;
      preHoverPick = null;
    }
    if (pick) {
      const _emit = (hover: boolean) => callback({
        type: 'HOVER',
        modifier,
        params: { context, pick, hover, scene: viewer.scene },
      });
      preHoverPick = pick;
      stopPrev = () => _emit(false);
      _emit(true);
    }
  };
  const fn = throttle(listener, 32); // 节流
  return (type: ScreenSpaceEventType, context?: any) => {
    if (context && type === ScreenSpaceEventType.MOUSE_MOVE) {
      fn(context);
    }
  };
}

/**
 * 创建一个拖拽绑定函数
 *
 * @param viewer Cesium Viewer实例
 * @param modifier 键盘事件修饰符，可选
 * @param callback 拖拽回调函数
 * @returns 返回一个处理拖拽事件的函数
 */
export function createDragBind(
  viewer: Viewer,
  modifier: KeyboardEventModifier | undefined,
  callback: GraphicsHandlerCallback<'DRAG'>,
) {
  let pick: any;
  let moved = false; // 鼠标当前是否存在移动行为
  let startPosition: Cartesian2 | undefined;

  return (type: ScreenSpaceEventType, context?: any) => {
    if (!context) {
      return;
    }
    if (type === ScreenSpaceEventType.LEFT_DOWN) {
      pick = viewer.scene.pick(context.position);
      startPosition = context.position.clone(); // 鼠标下按，该点为起始点
    }

    if (pick && type === ScreenSpaceEventType.MOUSE_MOVE) {
      let params: any;
      // 此前没有鼠标移动行为，则此次为拖拽循环中第一次触发，startPosition应为鼠标下按时的坐标
      if (!moved) {
        moved = true;
        params = {
          context: {
            startPosition: startPosition!,
            endPosition: context.endPosition,
          },
          pick,
          scene: viewer.scene,
          draging: true,
        };
      }
      else {
        startPosition = context.endPosition.clone();
        params = {
          context,
          pick,
          draging: true,
          scene: viewer.scene,
        };
      }
      callback({ type: 'DRAG', modifier, params });
    }

    // 鼠标抬起，结束拖拽循环
    if (pick && type === ScreenSpaceEventType.LEFT_UP) {
      const params = {
        context: {
          startPosition: startPosition!,
          endPosition: context.position,
        },
        pick,
        draging: false,
        scene: viewer.scene,
      };
      callback({ type: 'DRAG', modifier, params });
      pick = void 0;
      moved = false;
      startPosition = void 0;
    }
  };
}
