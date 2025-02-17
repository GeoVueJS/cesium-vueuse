# useEntity

Reactively load a Cesium `Entity`. Automatically destroy or reload the entity instance when the data changes.

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useEntity } from '@cesium-vueuse/core';

// Overload 1: Load a single entity instance
const entity = useEntity(entity);

// Overload 2: Load an array of entity instances
const entities = useEntity([entity1, entity2]);

// Example with configuration options
const isActive = ref(true);
const isLoading = ref(true);

const configuredEntity = useEntity(entity, {
  collection, // Optional: specify the entity collection
  isActive, // Optional: reactive boolean to control entity activity
  evaluating: isLoading // Optional: reactive boolean for loading state
});
```

## Type Definitions

:::dts ./index.ts
