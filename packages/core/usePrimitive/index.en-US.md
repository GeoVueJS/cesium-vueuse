# usePrimitive

Used for reactive loading of `Primitive`. It automatically destroys or reloads the `Primitive` instance when the data changes.

## Usage

:::demo src="./demo.vue"
:::

```ts
// Overload 1: Load a single instance
const primitive = usePrimitive(primitive);
const primitive = usePrimitive(new Cesium.Cesium3DTileset());

// Overload 2: Load an array of instances
const primitives = usePrimitive([primitive1, primitive2]);

const isActive = ref(true);
const isLoading = ref(true);

// Options
const primitive = usePrimitive(primitive, {
  collection, // Primitive collection
  isActive, // Whether to activate
  evaluating: isLoading // Loading status reference
});
```

## Type Definitions

:::dts ./index.ts
