# createViewer

初始化Viewer或复用已存在的实例，当前组件及其后代组件可以使用`useViewer`访问该实例。

## Usage

:::demo src="./demo.vue" :cesium="false"
:::

:::tip 提示
若 `useViewer` 与 `createViewer` 同时在同一组件内使用:

- `useViewer`需处于`createViewer`之后调用
- `useViewer`会优先使用当前组件`createViewer`创建的实例
  :::

```ts
// overLoad1:创建新实例，组件卸载时实例会自动销毁
const viewer = createViewer(elRef, {
  // ...options
});

// overLoad2:复用已存在的实例，组件卸载时实例不会自动销毁
const viewer = createViewer(viewer);

// 创建实例后，当前组件及其后代组件可以使用useViewer访问该实例
const viewer = useViewer();
```

## Type Definitions

:::dts ./index.ts
