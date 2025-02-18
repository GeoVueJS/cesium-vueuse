# useEntity

用于响应式加载`Entity`，当数据变化时自动销毁或重载entity实例

## Usage

:::demo src="./demo.vue"
:::

```ts
// overLoad1:加载单项实例
const entity = useEntity(entity);

// overLoad2:加载数组实例
const entities = useEntity([entity1, entity2]);

const isActive = ref(true);
const isLoading = ref(true);

// 配置项
const entity = useEntity(entity, {
  collection,
  isActive,
  evaluating: isLoading
});
```

## Type Definitions

:::dts ./index.ts
