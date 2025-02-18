# useDataSource

用于响应式加载 Cesium `DataSource`。当数据发生变化时，它会自动销毁或重载 `DataSource` 实例。

## Usage

:::demo src="./demo.vue"
:::

```ts
// 加载基础实例
const dataSource = useDataSource(someDataSource);

// 异步加载
const dataSource = useDataSource(async () => await getDataSource());

// 加载数组
const dataSources = useDataSource([dataSource1, dataSource2]);

const isLoading = ref(true);

// 使用配置项
const dataSource = useDataSource(someDataSource, {
  collection: someCollection, // 数据源集合
  isActive: true, // 是否激活
  evaluating: isLoading, // 加载状态引用
  destroyOnRemove: true, // 当数据源移除时是否销毁
});
```

## Type Definitions

:::dts ./index.ts
