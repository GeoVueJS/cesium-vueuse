# useCesiumEventListener

轻松使用`Cesium.Event`实例中的`addEventListener`，
当依赖数据发生变化或组件被卸载时，监听函数会自动重新重载或销毁。

## Usage

:::demo src="./demo.vue"
:::

:::tip 建议
在Cesium中，事件的触发往往是实时帧渲染引发的，可能会照成vue响应式无效刷新，所以监听函数最好进行节流处理。

`Vesium`提供的`throttle`函数、`VueUse`提供 [refThrottled](https://vueuse.org/shared/refThrottled/)，都的可以很方便的进行节流处理。
:::

```ts
import { useCesiumEventListener } from '@vesium/core';
import { throttle } from '@vesium/shared';
import { refThrottled } from '@vueuse/core';

const listener = throttle(() => {
  // TODO
}, 100);
useCesiumEventListener(() => viewer.value?.scene.postRender, listener);

const current = refThrottled(ref(new Date().getTime()), 100);
useCesiumEventListener(() => viewer.value?.scene.postRender, () => {
  current.value = new Date().getTime();
});
```

## Type Definitions

:::dts ./index.ts
