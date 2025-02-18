# usePrimitive

用于响应式加载`Primitive`，当数据变化时自动销毁或重载primitive实例

## Usage

:::demo src="./demo.vue"
:::

```ts
// overLoad1:加载单项实例
const primitive = usePrimitive(primitive);
const primitive = usePrimitive(new Cesiumn.Cesium3DTileset());

// overLoad2:加载数组实例
const primitives = usePrimitive([primitive, primitive]);

const isActive = ref(true);
const isLoading = ref(true);

// 配置项
const primitive = usePrimitive(primitive, {
  collection,
  isActive,
  evaluating: isLoading
});
```

## Type Definitions

:::dts ./index.ts
