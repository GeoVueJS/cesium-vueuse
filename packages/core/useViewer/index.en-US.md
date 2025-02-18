---
sort: 2
---

# useViewer

Retrieve the `Viewer` instance injected by `createViewer` in the current component or its ancestor components.

## Usage

:::warning
If `useViewer` and `createViewer` are used in the same component:

- `useViewer` must be called after `createViewer`.
- `useViewer` will prioritize using the `Viewer` instance created by `createViewer` in the current component.
  :::

#### Inject and Retrieve in the Same Component

```ts
createViewer(/** options */);

// Must be called after `createViewer`
const viewer = useViewer();
```

#### Inject and Retrieve in Descendant Components

```vue
// parent.vue
<script setup>
const elRef = ref<HTMLElement>();
const viewer = createViewer(elRef);
</script>

<template>
  <div ref="elRef" />
  <Child />
</template>
```

```vue
// child.vue
<script setup>
const viewer = useViewer();
</script>
```

## Type Definitions

:::dts ./index.ts
