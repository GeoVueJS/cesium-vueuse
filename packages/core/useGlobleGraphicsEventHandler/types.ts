import type { KeyboardEventModifier, Primitive, PrimitiveCollection, Scene, ScreenSpaceEventHandler } from 'cesium';

export type GraphicsSource = Primitive | PrimitiveCollection;

export type GraphicsPositiondEventType =
  'LEFT_DOWN' |
  'LEFT_UP' |
  'LEFT_CLICK' |
  'LEFT_DOUBLE_CLICK' |
  'RIGHT_DOWN' |
  'RIGHT_UP' |
  'RIGHT_CLICK' |
  'MIDDLE_DOWN' |
  'MIDDLE_UP' |
  'MIDDLE_CLICK';

/**
 * All mouse event type
 */
export type GraphicsEventType =
  'LEFT_DOWN' |
  'LEFT_UP' |
  'LEFT_CLICK' |
  'LEFT_DOUBLE_CLICK' |
  'RIGHT_DOWN' |
  'RIGHT_UP' |
  'RIGHT_CLICK' |
  'MIDDLE_DOWN' |
  'MIDDLE_UP' |
  'MIDDLE_CLICK' |
  'HOVER' |
  'DRAG';

/**
 * Parameters for mouse click event callback
 */
export interface GraphicsPositiondParams {
  scene: Scene;
  context: ScreenSpaceEventHandler.PositionedEvent;
  pick: any;
}

/**
 * Parameters for mouse hover event callback
 */
export interface GraphicsHoverParams {
  scene: Scene;
  context: ScreenSpaceEventHandler.MotionEvent;
  pick: any;
  hover: boolean;
}

/**
 * Parameters for mouse drag event callback
 */
export interface GraphicsDragParams {
  scene: Scene;
  context: ScreenSpaceEventHandler.MotionEvent;
  pick: any;
  draging: boolean;
}

/**
 * Parameters for graphics mouse interaction event callback
 */
export type GraphicsHandlerCallbackParams<T extends GraphicsEventType> =
T extends GraphicsPositiondEventType ?
  GraphicsPositiondParams :
  T extends 'HOVER' ?
    GraphicsHoverParams :
    T extends 'DRAG' ?
      GraphicsDragParams :
      unknown;

/**
 * Context for graphics mouse interaction event callback
 */
export interface GraphicsHandlerCallbackContext<T extends GraphicsEventType> {
  type: T;
  modifier: KeyboardEventModifier | undefined;
  params: GraphicsHandlerCallbackParams<T>;
}

/**
 * Graphics mouse interaction event callback
 */
export type GraphicsHandlerCallback<T extends GraphicsEventType> = (
  context: GraphicsHandlerCallbackContext<T>
) => void;
