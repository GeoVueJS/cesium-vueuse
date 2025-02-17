---
text: Best Practices
tip: beta
sort: 2
---

# Cesium VueUse Best Practices

This document aims to help you better use Cesium VueUse, avoid common issues, and improve application performance.

## Performance Optimization Practices

### Using Shallow Reactive APIs

When interacting with Cesium instances, it is recommended to use Vue's shallow reactive APIs (`shallowRef`, `shallowReactive`). The reasons are as follows:

1. Cesium instances contain a large amount of associated data and complex `this` context bindings
2. Using deep reactive APIs may interfere with Cesium's internal data interaction mechanisms
3. Deep monitoring of Cesium instances significantly reduces performance and has no practical significance

It is recommended to use `shallowRef` to create reactive references. If deep reactive updates are indeed needed, you can manually trigger updates by calling `triggerRef` after modifying internal values.

Example code:

```ts
// ❌ Not recommended: using deep reactivity
const entity = ref(new Cesium.Entity());

useEntity(entity);

watch(position, (position) => {
  entity.position = position; // Error: not accessing with .value
});
```

```ts
// ✅ Recommended: using shallow reactivity
const entity = shallowRef(new Cesium.Entity());

useEntity(entity);

watch(position, (position) => {
  entity.value.position = position; // Correct: accessing with .value
  triggerRef(entity); // Manually trigger update
});
```

Related documentation:

- [Vue.js - shallowRef](https://vuejs.org/api/reactivity-advanced.html#shallowref)
- [Vue.js - Reduce Reactivity Overhead for Large Immutable Structures](https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)

## Lifecycle Best Practices

### Avoid Directly Accessing Reactive Instances at Setup Top Level

During the rendering process of a Vue component, the `setup` function is executed only once, and at this time, related hooks may not have completed initialization. Therefore, please access and operate reactive instances within Vue's lifecycle hooks (such as `watch`, `watchEffect`, `computed`).

```vue
// ❌ Not recommended: accessing directly in setup
<script setup>
const entity = useEntity(new Cesium.Entity());
entity.value.position = 'xxx'; // Error: entity.value might be undefined at this time
</script>
```

```vue
// ✅ Recommended: accessing in lifecycle hooks
<script setup>
const entity = useEntity(new Cesium.Entity());

watchEffect(() => {
  if (entity.value) { // Ensure instance is initialized
    entity.value.position = 'xxx';
  }
});
</script>
```

## Architecture Design Best Practices

### Avoid Using Hooks in Global State Management

Due to how Cesium VueUse works, it is not recommended to use this library's Hooks in global state management like Vuex/Pinia. The reasons are:

1. `createViewer` is component instance-based
2. `viewer` instance transmission depends on the component tree
3. Even if global state management supports Composition API, it cannot obtain the viewer instance through `useViewer`
4. Most hook functions in this library depend on `useViewer`

Recommended approach: Store viewer-unrelated states in global state management, and handle data consumption and viewer interaction within components.

```ts
// ❌ Not recommended: using Hooks in store
// /src/store/main.ts
defineStore('main', () => {
  const entity = shallowRef(new Cesium.Entity({}));
  useEntity(entity); // Error: cannot access viewer instance
});
```

```ts
// ✅ Recommended: separation of concerns
// /src/store/main.ts
defineStore('main', () => {
  const entity = shallowRef(new Cesium.Entity({}));
  return { entity };
});

// /src/components/entity.vue
const mainStore = useMainStore();

const { viewer } = useViewer();
useEntity(() => mainStore.entity); // Handle viewer-related logic in component
```

## Reactive Data Handling

### MaybeRefOrGetter and toValue

Vue and VueUse extensively use the reactive variable parameter pattern. When the parameter type is `MaybeRefOrGetter`, the hook function internally uses `toValue` to get the actual value to ensure compliance with Vue's reactivity specifications.

```ts
type MaybeRefOrGetter<T> = Ref<T> | (() => T) | T;

function toValue<T>(value: MaybeRefOrGetter<T>): T;

toValue(1); // -> 1
toValue(ref(1)); // -> 1
toValue(() => 1); // -> 1
```

### MaybeRefOrAsyncGetter and toAwaitValue

To better support asynchronous data processing, Cesium VueUse extends the concept of `MaybeRefOrGetter`:

1. Introduces the `MaybeRefOrAsyncGetter` type
2. Implements the `toAwaitValue` method
3. Supports working with VueUse's `computedAsync`

This makes handling asynchronous data in Vue's reactive system more convenient.

```ts
export type MaybeAsyncGetter<T> = () => Promise<T> | T;
export type MaybeRefOrAsyncGetter<T> = MaybeRef<T> | MaybeAsyncGetter<T>;
function toAwaitValue<T>(value: MaybeRefOrAsyncGetter<T>): Promise<T>;

// Usage examples
toAwaitValue(1);
toAwaitValue(ref(1));
toAwaitValue(async () => await fetchData()); // -> Promise<T>

const value = computedAsync(() => toAwaitValue(asyncData));
```