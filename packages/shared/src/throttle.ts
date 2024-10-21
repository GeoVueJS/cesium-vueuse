import { promiseTimeout } from '@vueuse/shared';

export type ThrottleCallback<T extends any[]> = (...rest: T) => void;

/**
 * Throttle function, which limits the frequency of execution of the function
 *
 * @param callback raw function
 * @param delay Throttled delay duration (ms)
 * @param trailing Trigger callback function after last call @default true
 * @param leading Trigger the callback function immediately on the first call @default false
 * @returns Throttle function
 */
export function throttle<T extends any[]>(
  callback: ThrottleCallback<T>,
  delay = 100,
  trailing = true,
  leading = false,
): ThrottleCallback<T> {
  const restList: T[] = [];
  let tracked = false;
  const trigger = async () => {
    await promiseTimeout(delay);
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
        callback(...restList[restList.length - 1]!);
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
