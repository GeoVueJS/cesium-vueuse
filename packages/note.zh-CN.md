---
title: 注意事项
---

# 注意事项

## 避免使用`ref`、`reactive`等深度响应API去包裹Cesium相关实例

Cesium中的实例中均关联着大量的绑定数据且内部存在复杂的的`this`交互。若在Vue中使用`ref`、`reactive`等深度响应API包裹Cesium实例，
可能会影响Cesium无法进行内部的数据交互，且深度监听对于Cesium实例的监听效率会大大降低，是无意义的。

推荐使用 `shallowRef`。若存在深度响应式场景，可在修改内部值后调用`triggerRef`触发响应式更新。

```ts
// ❌ 错误
const entity = ref(new Cesium.Entity());

useEntity(entity);

watch(position, (position) => {
  entity.position = position;
});
```

```ts
// ✅ 推荐
const entity = shallowRef(new Cesium.Entity());

useEntity(entity);

watch(position, (position) => {
  entity.value.position = position;
  triggerRef(entity);
});
```

## 避免在setup顶层函数直接获取或消费相关响应式实例

vue的渲染过程中，setup函数仅会执行一次，而相关hooks函数此时可能并为初始化完成，所以请在如watch、watchEffect、computed等钩子函数中获取或消费相关响应式实例。

```vue
// ❌ 错误
<script setup>
const entity = useEntity(new Cesium.Entity());
entity.value.position = 'xxx'; // `entity.value` maybe undefined
</script>
```

```vue
// ✅ 推荐
<script setup>
const entity = useEntity(new Cesium.Entity());

watchEffect(() => {
  if (entity.value) {
    entity.value.position = 'xxx';
  }
});
</script>
```

## 避免在vuex、pinia中使用此库的Hooks

vuex、pinia挂载于全局，而`createViewer`挂载于组件实例，`viewer`实例的传递依赖组件，
所以即便pinia等全局状态管理支持`composition API`模式，依旧不能通过`useViewer`获取到viewer实例。

但此工具库中，几乎所有hook函数内部都调用了`useViewer`,所以请避免在vuex、pinia中使用此库中的任何hook函数。

如需全局状态管理的场景，可避免在pinia、vuex内部与viewer实例产生交互。请`只储存与viewer无关`的状态，随后在`组件内进行数据消费`。

```ts
// ❌ 错误

// /src/store/main.ts
defineStore('main', () => {
  const entity = shallowRef(new Cesium.Entity({}));
  useEntity(entity);
});
```

```ts
// ✅ 推荐

// /src/store/main.ts
defineStore('main', () => {
  const entity = shallowRef(new Cesium.Entity({}));

  return { entity };
});

// /src/components/entity.vue
const mainStore = useMainSotre();

const { viewer } = useViewer();
useEntity(() => mainStore.entity);
```
