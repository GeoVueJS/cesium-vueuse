import type { Cartesian2, KeyboardEventModifier, ScreenSpaceEventHandler, Viewer } from 'cesium';
import type { GraphicsHandlerCallback, GraphicsPositiondEventType } from './types';

import { throttle } from '@cesium-vueuse/shared';
import { ScreenSpaceEventType } from 'cesium';

const POSITIOND_EVENT_TYPE_MAP: Record<ScreenSpaceEventType, GraphicsPositiondEventType | undefined> = {
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
  [ScreenSpaceEventType.MOUSE_MOVE]: undefined,
  [ScreenSpaceEventType.WHEEL]: undefined,
  [ScreenSpaceEventType.PINCH_START]: undefined,
  [ScreenSpaceEventType.PINCH_END]: undefined,
  [ScreenSpaceEventType.PINCH_MOVE]: undefined,
};

/**
 * Create a mouse binding function for a single position.
 * eg. left-click of the mouse.
 *
 * @param viewer Viewer instance
 * @param modifier modifier key
 * @param callback Callback function for the position of the graphics object at the time of mouse click
 */
export function createPositiondBind(
  viewer: Viewer,
  modifier: KeyboardEventModifier | undefined,
  callback: GraphicsHandlerCallback<GraphicsPositiondEventType>,
) {
  return (type: ScreenSpaceEventType, context?: any) => {
    if (POSITIOND_EVENT_TYPE_MAP[type] && context) {
      const pick = viewer.scene.pick(context.position);
      if (pick) {
        callback({
          type: POSITIOND_EVENT_TYPE_MAP[type],
          modifier,
          params: { scene: viewer.scene, context, pick },
        });
      }
    }
  };
}

/**
 * Create a hover binding function
 *
 * @param viewer Viewer instance
 * @param modifier modifier key
 * @param callback Callback function for the position of the graphics object during mouse hover
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
    // Notify that the hover event of the previous loop has ended
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
  const fn = throttle(listener, 32);
  return (type: ScreenSpaceEventType, context?: any) => {
    if (context && type === ScreenSpaceEventType.MOUSE_MOVE) {
      fn(context);
    }
  };
}

/**
 * Create a mouse drag binding function
 *
 * @param viewer Viewer instance
 * @param modifier modifier key
 * @param callback Callback function for the position of the graphics object during mouse dragging
 */
export function createDragBind(
  viewer: Viewer,
  modifier: KeyboardEventModifier | undefined,
  callback: GraphicsHandlerCallback<'DRAG'>,
) {
  let pick: any;
  // Is there currently any mouse movement behavior
  let moved = false;
  let startPosition: Cartesian2 | undefined;

  return (type: ScreenSpaceEventType, context?: any) => {
    if (!context) {
      return;
    }
    if (type === ScreenSpaceEventType.LEFT_DOWN) {
      pick = viewer.scene.pick(context.position);
      // Mouse button pressed, this point is the starting point
      startPosition = context.position.clone();
    }

    if (pick && type === ScreenSpaceEventType.MOUSE_MOVE) {
      let params: any;
      // If there is no previous mouse movement, this is the first trigger in the drag loop,
      // and the `startPosition` should be the coordinate when the mouse button was pressed
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

    // Mouse up, end drag loop
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
