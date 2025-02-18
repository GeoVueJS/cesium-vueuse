# toPromiseValue

`toPromiseValue` is similar to Vue's built-in [toValue](https://vuejs.org/api/reactivity-utilities.html#tovalue), which normalizes values, Refs, or getters into plain values. In contrast, `toPromiseValue` normalizes them into Promise instances. It is recommended to use it alongside VueUse's [computedAsync](https://vueuse.org/core/computedAsync/) for better handling of asynchronous data.

## Usage

```ts
import { toPromiseValue } from '@vesium/core';
import { computedAsync, ref } from '@vueuse/core';

// Handling Promise instances
const promiseRef = ref(Promise.resolve('Hello World'));
const data = computedAsync(() => toPromiseValue(promiseRef));
// data.value -> 'Hello World'

// Handling async functions
async function asyncFn() {
  return 'Hello World';
}
const data = computedAsync(() => toPromiseValue(asyncFn));
// data.value -> 'Hello World'

// Handling regular Refs
const normalRef = ref('Hello World');
const data = computedAsync(() => toPromiseValue(normalRef));
// data.value -> 'Hello World'
```

## Type Definitions

:::dts ./index.ts
