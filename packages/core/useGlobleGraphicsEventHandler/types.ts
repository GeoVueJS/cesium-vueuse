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

export interface GraphicsPositiondParams {
  scene: Scene;
  context: ScreenSpaceEventHandler.PositionedEvent;
  pick: any;
}

export interface GraphicsHoverParams {
  scene: Scene;
  context: ScreenSpaceEventHandler.MotionEvent;
  pick: any;
  hover: boolean;
}

export interface GraphicsDragParams {
  scene: Scene;
  context: ScreenSpaceEventHandler.MotionEvent;
  pick: any;
  draging: boolean;
}

export type GraphicsHandlerCallbackParams<T extends GraphicsEventType> = T extends GraphicsPositiondEventType ? GraphicsPositiondParams :
  T extends 'HOVER' ? GraphicsHoverParams :
    T extends 'DRAG' ? GraphicsDragParams :
      unknown;

export interface GraphicsHandlerCallbackContext<T extends GraphicsEventType> {
  type: T;
  modifier: KeyboardEventModifier | undefined;
  params: GraphicsHandlerCallbackParams<T>;
}

export type GraphicsHandlerCallback<T extends GraphicsEventType> = (
  context: GraphicsHandlerCallbackContext<T>
) => void;
