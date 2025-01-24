import type { Nullable } from '@cesium-vueuse/shared';
import type { Cartesian3, Entity, ScreenSpaceEventHandler, Viewer } from 'cesium';
import type { CSSProperties, MaybeRef, VNode } from 'vue';
import type { SmapledPlotPackable, SmapledPlotProperty } from './SmapledPlotProperty';

export interface SkeletonDisabledOptions {

  /**
   * 当前标绘是否是否正在激活，即正在编辑状态
   */
  active: boolean;

  /**
   * 当前标绘是否还在定义态，即还未完成采集
   */
  defining: boolean;
}

export interface OnSkeletonClickOptions {
  viewer: Viewer;

  /**
   * 当前标绘属性数据
   */
  smaple: SmapledPlotProperty;

  /**
   * 标绘采集到的数据，通过该数据可以获取到当前标绘的所有点位信息
   */
  packable: SmapledPlotPackable<any>;

  /**
   * 当前标绘是否是否正在激活，即正在编辑状态
   */
  active: boolean;

  /**
   * 当前标绘是否还在定义态，即还未完成采集
   */
  defining: boolean;

  /**
   * 当前被点击的控制点索引
   */
  index: number;

  /**
   * 鼠标点击事件上下文信息
   */
  context: ScreenSpaceEventHandler.PositionedEvent;
}

export interface OnSkeletonDragOptions {
  viewer: Viewer;

  /***
   * 当前标绘属性数据
   */
  smaple: SmapledPlotProperty;

  /**
   * 标绘采集到的数据，通过该数据可以获取到当前标绘的所有点位信息
   */
  packable: SmapledPlotPackable<any>;

  /**
   * 当前标绘是否是否正在激活，即正在编辑状态
   */
  active: boolean;

  /**
   * 当前标绘是否还在定义态，即还未完成采集
   */
  defining: boolean;

  /**
   * 当前被拖拽的控制点索引
   */
  index: number;

  /**
   * 鼠标拖拽事件上下文信息
   */
  context: ScreenSpaceEventHandler.MotionEvent;

  /**
   * 当前的拖拽状态
   */
  dragging: boolean;

  /**
   * 执行是否锁定相机视角
   */
  lockCamera: () => void;
}

export interface OnKeyPressedOptions {
  viewer: Viewer;

  /**
   * 当前标绘属性数据
   */
  smaple: SmapledPlotProperty;

  /**
   * 标绘采集到的数据，通过该数据可以获取到当前标绘的所有点位信息
   */
  packable: SmapledPlotPackable<any>;

  /**
   * 当前标绘是否还在定义态，即还未完成采集
   */
  defining: boolean;

  /**
   * 当前被点击的控制点索引
   */
  index: number;

  /**
   * 被按压的按键数组，例如：['Shift', 'Control', 'Up' , Down]
   */
  keys: string[];
}

/**
 * 框架点执行状态枚举
 * - IDLE 空闲状态
 * - HOVER 悬停状态
 * - ACTIVE 激活状态
 * - OPERATING 操作状态
 */
export enum PlotAction {
  IDLE = 0,
  HOVER = 1,
  ACTIVE = 2,
  OPERATING = 3,
}

export interface SkeletonRenderOptions {
  /**
   * 标绘采集到的数据，通过该数据可以获取到当前标绘的所有点位信息
   */
  packable: SmapledPlotPackable;

  /**
   * 所有框架点位集合
   */
  positions: Cartesian3[];

  /**
   * 当前渲染的框架点索引
   */
  index: number;
  /**
   * 当前应当渲染的位置
   */
  position: Cartesian3;

  /**
   * 当前标绘是否是否正在激活，即正在编辑状态
   */
  active: boolean;

  /**
   * 当前标绘是否还在定义态，即还未完成采集
   */
  defining: boolean;

  /**
   * 当前框架点执行状态
   */
  action: PlotAction;
}

/**
 * 控制点配置项
 */
export interface PlotSkeleton {
  /**
   * 是否禁用控制点
   */
  diabled?: boolean | ((options: SkeletonDisabledOptions) => boolean);
  /**
   * 实际情况中，并非所有采集都都要渲染对应框架点，通过`format`函数可以过滤掉不需要渲染的点位，另外还可以自定义点位的偏移、增加框架点
   * @param packable  标绘采集到的数据
   */
  format?: (packable: SmapledPlotPackable<any>) => Cartesian3[];

  /**
   * 点位渲染函数，返回Entity的构造参数，如果不返回任何值则不渲染该点位
   */
  render?: (options: SkeletonRenderOptions) => Entity.ConstructorOptions | undefined;

  /**
   *  Cursor style when hovering.
   */
  cursor?: MaybeRef<Nullable<CSSProperties['cursor']>> | ((pick: any) => Nullable<CSSProperties['cursor']>);

  /**
   *  Cursor style when dragging.
   */
  dragCursor?: MaybeRef<Nullable<CSSProperties['cursor']>> | ((pick: any) => Nullable<CSSProperties['cursor']>);

  /**
   * 鼠标悬停在框架点时显示的提示信息
   */
  tip?: (options: SkeletonRenderOptions) => string | VNode | string | undefined;

  /**
   * 框架点鼠标左键点击时的处理逻辑
   */
  onLeftClick?: (options: OnSkeletonClickOptions) => void;

  /**
   * 框架点被拖拽时的处理逻辑
   */
  onDrag?: (options: OnSkeletonDragOptions) => void;

  /**
   * 键盘按键按下时的处理逻辑
   */
  onKeyPressed?: (options: OnKeyPressedOptions) => void;
}
