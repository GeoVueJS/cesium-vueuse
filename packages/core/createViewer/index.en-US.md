---
sort: 1
---

# createViewer

Initializes a Viewer or reuses an existing instance, which can be accessed by `useViewer` in the current component and its descendant components.

## Usage

:::demo src="./demo.vue" :cesium="false"
:::

:::warning Note
If `useViewer` and `createViewer` are used in the same component:

- `useViewer` should be called after `createViewer`

- `useViewer` will preferentially use the instance created by `createViewer` in the current component
  :::

```ts
// overLoad1: Creates a new instance, which is automatically destroyed when the component unmounts
const viewer = createViewer(elRef, {
  // ...options
});

// overLoad2: Injects an existing instance, which is not automatically destroyed when the component unmounts
const viewer = createViewer(window.viewer);

// After creating an instance, the current component and its descendant components can access the instance using useViewer
const viewer = useViewer();
```
