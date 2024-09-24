# useScreenSpaceEventHandler

轻松使用`ScreenSpaceEventHandler`，当依赖数据发生变化或组件被卸载时，监听函数会自动重新重载或销毁。

## Usage

:::demo src="./demo.vue"
:::

```ts
const { isActive, pause, resume } = useScreenSpaceEventHandler({
  type: Cesium.ScreenSpaceEventType.LEFT_CLICK,
  // modifier: Cesium.KeyboardEventModifier.SHIFT,
  // pause: false,
  inputAction: (ctx) => {
    console.log(ctx);
  }
});
```

## Type Definitions

:::dts ./index.ts
