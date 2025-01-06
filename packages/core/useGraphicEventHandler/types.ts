import type { ScreenSpaceEventHandler } from 'cesium';

/**
 * Parameters for graphics click related events
 */
export interface GraphicPositionedEventParams {
  /**
   * Context of the picked area
   */
  context: ScreenSpaceEventHandler.PositionedEvent;
  /**
   * The graphic object picked by `scene.pick`
   */
  pick: any;
}

/**
 * Parameters for graphic hover events
 */
export interface GraphicHoverEventParams {
  /**
   * Context of the motion event
   */
  context: ScreenSpaceEventHandler.MotionEvent;
  /**
   * The graphic object picked by `scene.pick`
   */
  pick: any;
  /**
   * Whether the mouse is currently hovering over the graphic. Returns `true` continuously while hovering, and `false` once it ends.
   */
  hover: boolean;
}

/**
 * Parameters for graphic drag events
 */
export interface GraphicDragEventParams {
  /**
   * Context of the motion event
   */
  context: ScreenSpaceEventHandler.MotionEvent;
  /**
   * The graphic object picked by `scene.pick`
   */
  pick: any;
  /**
   * Whether the graphic is currently being dragged. Returns `true` continuously while dragging, and `false` once it ends.
   */
  draging: boolean;
}

/**
 * Listener for graphic click related events
 */
export type GraphicPositionedEventListener = (params: GraphicPositionedEventParams) => void;

/**
 * Listener for graphic hover events
 */
export type GraphicHoverEventListener = (params: GraphicHoverEventParams) => void;

/**
 * Listener for graphic drag events
 */
export type GraphicDragEventListener = (params: GraphicDragEventParams) => void;
