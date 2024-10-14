import type { Fn } from '@vueuse/core';
import type { Ref } from 'vue';
import { ref } from 'vue';

export interface Pausable {
  /**
   * A ref indicate whether a pausable instance is active
   */
  isActive: Ref<boolean>;
  /**
   * Temporary pause the effect from executing
   */
  pause: Fn;
  /**
   * Resume the effects
   */
  resume: Fn;
}

export type RestPausable = [
  /**
   * A ref indicate whether a pausable instance is active
   */
  isActive: Ref<boolean>,
  /**
   * Temporary pause the effect from executing
   */
  pause: Fn,
  /**
   * Resume the effects
   */
  resume: Fn,
];

export type PausableState = Pausable & RestPausable;

/**
 * 创建一个可暂停的状态
 */
export function createPausable(pause?: boolean): PausableState {
  const isActive = ref(!pause);
  const result = {
    isActive,
    pause: () => isActive.value = false,
    resume: () => isActive.value = true,
  };

  return Object.assign(
    {},
    result,
    [
      result.isActive,
      result.pause,
      result.resume,
    ],
  ) as unknown as PausableState;
}
