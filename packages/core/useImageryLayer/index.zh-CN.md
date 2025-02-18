# useImageryLayer

用于响应式加载`ImageryLayer`，当数据变化时自动销毁或重载imageryLayer实例

## Usage

:::demo src="./demo.vue"
:::

```ts
// 加载基础实例
const images = useImageryLayer(layer);

// 加载异步实例
const dataSource = useImageryLayer(async () => await getLayer());

// 加载数组
const dataSources = useImageryLayer([layer1, layer2]);

const isLoading = ref(true);

// 配置项
const dataSource = useImageryLayer(layer, {
  collection,
  isActive,
  evaluating: isLoading,
  destroyOnRemove: false,
});
```

## Type Definitions

:::dts ./index.ts
