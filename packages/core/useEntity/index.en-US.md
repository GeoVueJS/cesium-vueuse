# useEntity

Used for reactive loading of `Entity`. It automatically destroys or reloads the `Entity` instance when the data changes.

## Usage

:::demo src="./demo.vue"
:::

```ts
// Overload 1: Load a single instance
const entity = useEntity(entity);

// Overload 2: Load an array of instances
const entities = useEntity([entity1, entity2]);

const isActive = ref(true);
const isLoading = ref(true);

// Options
const entity = useEntity(entity, {
  collection, // Entity collection
  isActive, // Whether to activate
  evaluating: isLoading // Loading status reference
});
```

## Type Definitions

:::dts ./index.ts
