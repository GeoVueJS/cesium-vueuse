# toPromiseValue

`toPromiseValue` 类似于 Vue 内置的 [toValue](https://vuejs.org/api/reactivity-utilities.html#tovalue)，后者将值、Refs 或 getters 规范化为普通值，而 `toPromiseValue` 则将其规范化为 Promise 实例。建议与 VueUse 的 [computedAsync](https://vueuse.org/core/computedAsync/) 搭配使用，以便更好地处理异步数据。

## Usage

```ts
import { toPromiseValue } from '@vesium/core';
import { computedAsync, ref } from '@vueuse/core';

// 处理 Promise 实例
const promiseRef = ref(Promise.resolve('Hello World'));
const data = computedAsync(() => toPromiseValue(promiseRef));
// data.value -> 'Hello World'

// 处理异步函数
async function asyncFn() {
  return 'Hello World';
}
const data = computedAsync(() => toPromiseValue(asyncFn));
// data.value -> 'Hello World'

// 处理普通的 Ref
const normalRef = ref('Hello World');
const data = computedAsync(() => toPromiseValue(normalRef));
// data.value -> 'Hello World'
```

## Type Definitions

:::dts ./index.ts
