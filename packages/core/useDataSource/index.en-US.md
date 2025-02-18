# useDataSource

Used for reactive loading of Cesium `DataSource`. It automatically destroys or reloads the `DataSource` instance when the data changes.

## Usage

:::demo src="./demo.vue"
:::

```ts
// Load a basic instance
const dataSource = useDataSource(someDataSource);

// Asynchronous loading
const dataSource = useDataSource(async () => await getDataSource());

// Load an array
const dataSources = useDataSource([dataSource1, dataSource2]);

const isLoading = ref(true);

// Use options
const dataSource = useDataSource(someDataSource, {
  collection: someCollection, // DataSource collection
  isActive: true, // Whether to activate
  evaluating: isLoading, // Loading status reference
  destroyOnRemove: true, // Whether to destroy when the DataSource is removed
});
```

## Type Definitions

:::dts ./index.ts
