---
type: base
---

# useViewer

获取当前组件或其祖先组件通过`createViewer`注入的`Viewer`实例

## Usage

```ts
const viewer = useViewer();
```

::: warning 注意

- 如果在同一个组件中同时调用了`createViewer`，则`useViewer`将优先使用当前组件注入的`Viewer`实例
- 在同一组件中调用`createViewer`和`useViewer`时，应在`useViewer`之前调用`createViewer`
  :::

## Type Definitions

:::dts ./index.ts
