---
sort: 2
---

# useViewer

获取当前组件或其祖先组件通过 `createViewer` 注入的 `Viewer` 实例。

## Usage

:::warning
若 `useViewer` 与 `createViewer` 同时在同一组件内使用：

- `useViewer` 需在 `createViewer` 之后调用。
- `useViewer` 会优先使用当前组件 `createViewer` 创建的实例。
  :::

#### 同一组件注入并获取

```ts
createViewer(/** options */);

// 必须在 `createViewer` 之后
const viewer = useViewer();
```

#### 注入后，子孙组件获取

```vue
// parent.vue
<script setup>
const elRef = ref<HTMLElement>();
const viewer = createViewer(elRef);
</script>

<template>
  <div ref="elRef" />
  <Child />
</template>
```

```vue
// child.vue
<script setup>
const viewer = useViewer();
</script>
```

## Type Definitions

:::dts ./index.ts
