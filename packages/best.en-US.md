---
text: Best Practices
tip: beta
sort: 2
---

# Best Practices

## Use `shallowRef` and `shallowReactive` for Better Performance

When working with Cesium instances in Vue applications, it's important to understand that each Cesium object maintains its own complex internal state and bindings. These instances contain numerous properties and handle complex `this` context interactions internally.

Using Vue's deep reactive APIs like `ref` or `reactive` to wrap Cesium instances can:

- Interfere with Cesium's internal state management
- Significantly degrade performance due to unnecessary deep reactivity tracking
- Create potential conflicts between Vue's reactivity system and Cesium's internal updates

For optimal performance and stability, use `shallowRef`. If you need to track deep reactive changes, you can manually trigger updates using `triggerRef` after modifying internal values.

```ts
// ❌ Wrong - Using ref causes unnecessary deep reactivity
const entity = ref(new Cesium.Entity());

useEntity(entity);

watch(position, (position) => {
  entity.position = position; // Incorrect access and may cause performance issues
});
```

```ts
// ✅ Recommended - Using shallowRef for better performance
const entity = shallowRef(new Cesium.Entity());

useEntity(entity);

watch(position, (position) => {
  entity.value.position = position;
  triggerRef(entity); // Manually trigger updates when needed
});
```

For more information, see:

- [vue.js shallowRef Documentation](https://vuejs.org/api/reactivity-advanced.html#shallowref)
- [vue.js Performance Optimization Guide](https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)

## Handle Reactive Instances Properly in Setup Function

In Vue's composition API, the `setup` function executes only once during component initialization. At this point, various hook functions and their associated resources might not be fully initialized. This is particularly important when working with Cesium entities and viewers.

To ensure proper initialization and reactivity, always access and modify reactive instances within Vue's lifecycle hooks such as `watch`, `watchEffect`, or `computed`.

```vue
// ❌ Wrong - Direct access in setup might fail
<script setup>
const entity = useEntity(new Cesium.Entity());
entity.value.position = 'xxx'; // Unsafe: entity.value might be undefined
</script>
```

```vue
// ✅ Recommended - Safe access within lifecycle hooks
<script setup>
const entity = useEntity(new Cesium.Entity());

watchEffect(() => {
  if (entity.value) {
    entity.value.position = 'xxx'; // Safe: checks for existence first
  }
});
</script>
```

## Keep Hooks Outside of Global State Management

This library's hooks are designed to work with component-scoped Cesium instances. A key architectural decision to understand is:

- `createViewer` creates component-scoped Cesium viewer instances
- Vuex and Pinia operate at the global application level
- The `viewer` instance is passed through component context

Even though Pinia and Vuex support the Composition API, you cannot use `useViewer` or other hooks from this library within them because nearly all hooks internally depend on `useViewer` to access the component-scoped Cesium viewer.

For global state management:

1. Store only viewer-independent state in Pinia/Vuex
2. Handle all Cesium-related operations within components
3. Use the store as a data source, not for direct Cesium interactions

```ts
// ❌ Wrong - Hooks won't work in store modules
// /src/store/main.ts
defineStore('main', () => {
  const entity = shallowRef(new Cesium.Entity({}));
  useEntity(entity); // This will fail
});
```

```ts
// ✅ Recommended - Proper separation of concerns
// /src/store/main.ts
defineStore('main', () => {
  const entity = shallowRef(new Cesium.Entity({}));
  return { entity }; // Only store the entity reference
});

// /src/components/entity.vue
const mainStore = useMainSotre();
const { viewer } = useViewer();
useEntity(() => mainStore.entity); // Handle Cesium operations in component
```

## Understanding Reactive Types and Values

### MaybeRefOrGetter | toValue

Vue and VueUse introduce flexible ways to handle reactive values. The `MaybeRefOrGetter` type represents a value that could be:

- A direct value
- A `ref` containing a value
- A getter function returning a value

The `toValue` utility unwraps these different forms consistently:

```ts
type MaybeRefOrGetter<T> = Ref<T> | (() => T) | T;

function toValue<T>(value: MaybeRefOrGetter<T>): T;

toValue(1); //       --> 1         // Direct value
toValue(ref(1)); //  --> 1         // Ref value
toValue(() => 1); // --> 1         // Getter function
```

### MaybeRefOrAsyncGetter | toAwaitValue

CesiumVueUse extends this pattern to handle async operations seamlessly. The `MaybeRefOrAsyncGetter` type and `toAwaitValue` utility enable working with:

- Synchronous values
- Async values
- Refs containing either sync or async values
- Getter functions returning promises

This is particularly useful when working with Cesium's async operations like loading terrain or imagery:

```ts
export type MaybeAsyncGetter<T> = () => Promise<T> | T;
export type MaybeRefOrAsyncGetter<T> = MaybeRef<T> | MaybeAsyncGetter<T>;
function toAwaitValue<T>(value: MaybeRefOrAsyncGetter<T>): Promise<T>;

toAwaitValue(1);
toAwaitValue(ref(1));
toAwaitValue(async () => fn()); // Handles async operations

// Use with computedAsync for reactive async values
const value = componentAsync(() => toAwaitValue(any));
```
