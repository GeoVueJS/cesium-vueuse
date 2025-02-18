# useImageryLayer

Used for reactive loading of `ImageryLayer`. It automatically destroys or reloads the `ImageryLayer` instance when the data changes.

## Usage

:::demo src="./demo.vue"
:::

```ts
// Load a basic instance
const images = useImageryLayer(layer);

// Load an asynchronous instance
const dataSource = useImageryLayer(async () => await getLayer());

// Load an array
const dataSources = useImageryLayer([layer1, layer2]);

const isLoading = ref(true);

// Options
const dataSource = useImageryLayer(layer, {
  collection, // ImageryLayer collection
  isActive, // Whether to activate
  evaluating: isLoading, // Loading status reference
  destroyOnRemove: false, // Whether to destroy when the ImageryLayer is removed
});
```

## Type Definitions

:::dts ./index.ts
