export interface PlottedScheme {
  type: string;

  /**
   * 每次新增左键新增控制点时进行回调判断是否允许左键双击停止定义态。
   */
  manualTerminate?: () => boolean;

  /**
   * 每次左键新增控制点时进行回调判断是否立即终止定义态。
   */
  forceTerminate?: () => boolean;
}
