# useEntity

响应式加载`DataSource`，当数据变化时自动销毁或重载dataSource实例

## Usage

:::demo src="./demo.vue"
:::

```ts
// 加载基础实例
const imageryLayer = useDataSource(imageryLayer);

// 加载异步实例
const imageryLayer = useDataSource(async () => await getDataSource());

// 加载数组
const dataSources = useDataSource([dataSource1, dataSource2]);

const isLoading = ref(true);

// 配置项
const imageryLayer = useDataSource(imageryLayer, {
  collection,
  isActive,
  evaluating: isLoading,
  destroyOnRemove: true,
});
```

## Type Definitions

:::dts ./index.ts
