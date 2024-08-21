import { promiseTimeout } from '@vueuse/shared';

export type ThrottleCallback<T extends any[]> = (...rest: T) => void;

/**
 * 节流函数，限制函数的执行频率
 *
 * @param callback 需要节流的回调函数
 * @param ms 最小触发间隔，单位毫秒，默认为100ms
 * @param trailing 是否在最后一次调用后触发回调函数，默认为true
 * @param leading 是否在第一次调用时立即触发回调函数，默认为false
 * @returns 返回节流后的回调函数
 */
export function throttle<T extends any[]>(
  callback: ThrottleCallback<T>,
  ms = 100,
  trailing = true,
  leading = false,
): ThrottleCallback<T> {
  const restList: T[] = [];
  let tracked = false;
  const trigger = async () => {
    await promiseTimeout(ms);
    tracked = false;
    if (leading) {
      try {
        callback(...restList[0]);
      }
      catch (error) {
        console.error(error);
      }
    }
    if (trailing && (!leading || restList.length > 1)) {
      try {
        callback(...restList.at(-1)!);
      }
      catch (error) {
        console.error(error);
      }
    }
    restList.length = 0;
  };

  return (...rest: T) => {
    if (restList.length < 2) {
      restList.push(rest);
    }
    else {
      restList[1] = rest;
    }

    if (!tracked) {
      tracked = true;
      trigger();
    }
  };
}
