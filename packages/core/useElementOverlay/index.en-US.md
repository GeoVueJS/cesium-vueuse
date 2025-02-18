# useElementOverlay

Overlay HTML elements on a Cesium map and reactively update their positions.

## Usage

:::demo src="./demo.vue"
:::

```ts
// Basic usage
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
