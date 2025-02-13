---
text: 最佳实践
tip: beta
sort: 2
---

# Cesium VueUse 最佳实践

本文档旨在帮助您更好地使用 Cesium VueUse，避免常见问题，提升应用性能。

## 性能优化实践

### 使用浅层响应式 API

在与 Cesium 实例交互时，建议使用 Vue 的浅层响应式 API (`shallowRef`、`shallowReactive`)。原因如下：

1. Cesium 实例内部包含大量关联数据和复杂的 `this` 上下文绑定
2. 使用深层响应式 API 可能会干扰 Cesium 内部的数据交互机制
3. 对 Cesium 实例进行深层监听会显著降低性能，且没有实际意义

推荐使用 `shallowRef` 创建响应式引用。如果确实需要深度响应式更新，可在修改完内部值后调用 `triggerRef` 手动触发更新。

示例代码：

```ts
// ❌ 不推荐：使用深层响应式
const entity = ref(new Cesium.Entity());

useEntity(entity);

watch(position, (position) => {
  entity.position = position; // 错误：未使用 .value 访问
});
```

```ts
// ✅ 推荐：使用浅层响应式
const entity = shallowRef(new Cesium.Entity());

useEntity(entity);

watch(position, (position) => {
  entity.value.position = position; // 正确：使用 .value 访问
  triggerRef(entity); // 手动触发更新
});
```

相关文档：

- [Vue.js - shallowRef](https://vuejs.org/api/reactivity-advanced.html#shallowref)
- [Vue.js - 大型不可变数据的响应性能优化](https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)

## 生命周期最佳实践

### 避免在 setup 顶层直接访问响应式实例

在 Vue 组件的渲染过程中，`setup` 函数仅执行一次，此时相关 hooks 可能尚未完成初始化。因此，请在 Vue 的生命周期钩子函数（如 `watch`、`watchEffect`、`computed`）中访问和操作响应式实例。

```vue
// ❌ 不推荐：直接在 setup 中访问
<script setup>
const entity = useEntity(new Cesium.Entity());
entity.value.position = 'xxx'; // 错误：此时 entity.value 可能为 undefined
</script>
```

```vue
// ✅ 推荐：在生命周期钩子中访问
<script setup>
const entity = useEntity(new Cesium.Entity());

watchEffect(() => {
  if (entity.value) { // 确保实例已初始化
    entity.value.position = 'xxx';
  }
});
</script>
```

## 架构设计最佳实践

### 避免在全局状态管理中使用 Hooks

由于 Cesium VueUse 的工作原理，不建议在 Vuex/Pinia 等全局状态管理中使用本库的 Hooks。原因如下：

1. `createViewer` 是基于组件实例的
2. `viewer` 实例的传递依赖于组件树
3. 即便全局状态管理支持 Composition API，也无法通过 `useViewer` 获取 viewer 实例
4. 本库中的大多数 hook 函数都依赖于 `useViewer`

推荐做法：将与 viewer 无关的状态存储在全局状态管理中，在组件内部进行数据消费和 viewer 交互。

```ts
// ❌ 不推荐：在 store 中使用 Hooks
// /src/store/main.ts
defineStore('main', () => {
  const entity = shallowRef(new Cesium.Entity({}));
  useEntity(entity); // 错误：无法访问 viewer 实例
});
```

```ts
// ✅ 推荐：分离关注点
// /src/store/main.ts
defineStore('main', () => {
  const entity = shallowRef(new Cesium.Entity({}));
  return { entity };
});

// /src/components/entity.vue
const mainStore = useMainStore();

const { viewer } = useViewer();
useEntity(() => mainStore.entity); // 在组件中处理 viewer 相关逻辑
```

## 响应式数据处理

### MaybeRefOrGetter 与 toValue

Vue 和 VueUse 中广泛使用了响应式变量传参模式。当参数类型为 `MaybeRefOrGetter` 时，hook 函数内部会通过 `toValue` 获取实际值，以确保符合 Vue 的响应式规范。

```ts
type MaybeRefOrGetter<T> = Ref<T> | (() => T) | T;

function toValue<T>(value: MaybeRefOrGetter<T>): T;

toValue(1); // -> 1
toValue(ref(1)); // -> 1
toValue(() => 1); // -> 1
```

### MaybeRefOrAsyncGetter 与 toAwaitValue

Cesium VueUse 为了更好地支持异步数据处理，扩展了 `MaybeRefOrGetter` 的概念：

1. 引入 `MaybeRefOrAsyncGetter` 类型
2. 实现 `toAwaitValue` 方法
3. 支持与 VueUse 的 `computedAsync` 配合使用

这使得在 Vue 响应式系统中处理异步数据变得更加便捷。

```ts
export type MaybeAsyncGetter<T> = () => Promise<T> | T;
export type MaybeRefOrAsyncGetter<T> = MaybeRef<T> | MaybeAsyncGetter<T>;
function toAwaitValue<T>(value: MaybeRefOrAsyncGetter<T>): Promise<T>;

// 使用示例
toAwaitValue(1);
toAwaitValue(ref(1));
toAwaitValue(async () => await fetchData()); // -> Promise<T>

const value = computedAsync(() => toAwaitValue(asyncData));
```
