# useCesiumEventListener

Easily use `addEventListener` in `Cesium.Event` instances, with automatic reloading or destruction of listener functions when dependent data changes or the component is unmounted.

## Usage

:::demo src="./demo.vue"
:::

:::tip Suggestion
In Cesium, event triggers are often caused by real-time frame rendering, which may cause invalid refreshing of Vue's reactivity. Therefore, it is recommended to perform throttling on the listener functions. The `throttle` function provided by `Vesium` and [refThrottled](https://vueuse.org/shared/refThrottled/) provided by `VueUse` can both facilitate throttling processing.
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
:::
