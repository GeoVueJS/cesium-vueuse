import type { AnyFn } from '@cesium-vueuse/shared';
import type { Viewer } from 'cesium';
import type { EffectScope } from 'vue';
import { effectScope, onScopeDispose, watch } from 'vue';
import { useViewer } from '../useViewer';

/**
 * 创建一个缓存执行结果的函数
 * @param fn 需要执行的函数
 * @returns 返回一个函数，如果 viewer 实例一致则返回缓存结果，否则执行函数并缓存结果
 */
export function createCachedViewerComposable<Fn extends AnyFn>(
  fn: Fn,
): Fn {
  // 使用 WeakMap 存储每个 viewer 实例的执行结果
  const cache = new WeakMap<Viewer, ReturnType<Fn>>();
  // 存储每个 viewer 实例的 effectScope
  const scopes = new WeakMap<Viewer, EffectScope>();

  return ((...args: any[]) => {
    // 获取 viewer ref
    const viewerRef = useViewer();

    // 如果 viewerRef.value 为空，则不执行逻辑
    if (!viewerRef.value) {
      return undefined;
    }

    // 如果缓存中存在当前 viewer 实例的结果，则直接返回
    if (cache.has(viewerRef.value)) {
      return cache.get(viewerRef.value);
    }

    // 创建一个新的 effectScope
    const scope = effectScope(true);
    scopes.set(viewerRef.value, scope);

    // 执行函数并缓存结果
    const result = scope.run(() => fn(viewerRef.value, ...args)) as ReturnType<Fn>;
    cache.set(viewerRef.value, result);

    // 监听 viewerRef.value 变化，清理缓存
    watch(
      viewerRef,
      (newViewer, oldViewer) => {
        if (oldViewer && scopes.has(oldViewer)) {
          scopes.get(oldViewer)?.stop();
          cache.delete(oldViewer);
          scopes.delete(oldViewer);
        }
        if (newViewer && !cache.has(newViewer)) {
          const newScope = effectScope(true);
          scopes.set(newViewer, newScope);
          const newResult = newScope.run(() => fn(newViewer, ...args)) as ReturnType<Fn>;
          cache.set(newViewer, newResult);
        }
      },
      { immediate: false },
    );

    // 在当前作用域卸载时清理缓存和 effectScope
    onScopeDispose(() => {
      scope.stop();
      cache.delete(viewerRef.value!);
      scopes.delete(viewerRef.value!);
    });

    return result;
  }) as Fn;
}
