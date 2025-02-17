# useElementOverlay

在 Cesium 地图上叠加 HTML 元素，并响应式地更新其位置。

## Usage

:::demo src="./demo.vue"
:::

```ts
// 基本用法
const { x, y, elementOverlay } = useElementOverlay(
  targetElement,
  position,
  {
    horizontal: 'center',
    vertical: 'bottom',
    offset: { x: 0, y: 0 },
    referenceWindow: false,
    ms: 8,
  }
);
```

## Type Definitions

:::dts ./index.ts
