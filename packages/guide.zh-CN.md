# 开始使用

CesiumVueuse 是一个基于[Cesium](https://github.com/CesiumGS/cesium)工具库，提供与 [VueUse](https://vueuse.org) 相似的函数风格，旨在简化Cesium在vue中的使用。
在继续之前，我们假设您已经熟悉了 [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) 的基础概念，并具备了Cesium、VueUse的使用经验。

## 安装

CesiumVueuse 依赖于Cesium, @vueuse/core，需同时安装。

```bash
npm i cesium @vueuse/core @cesium-vueuse/core
# or
yarn add cesium @vueuse/core @cesium-vueuse/core
# or
pnpm i cesium @vueuse/core @cesium-vueuse/core
```

### CDN

```html
<script src="https://unpkg.com/cesium/Build/Cesium/Cesium.js"></script>

<script src="https://unpkg.com/@vueuse/shared"></script>
<script src="https://unpkg.com/@vueuse/core"></script>

<script src="https://unpkg.com/@cesium-vueuse/shared"></script>
<script src="https://unpkg.com/@cesium-vueuse/core"></script>
```

它将以 global 的形式公开`window.CesiumVueUse`

# 最佳实践

## 优先使用shallowRef

请优先使用`shallowRef`。Cesium中存在大量的class实例，且内部使用了`this`关键字，使用`ref`会将这些实例进行深度代理，
可能照成实例内部的`this`指向发生异常。Cesium中各类实例往往还伴随着大量的数据，使用`ref`会使程序的响应式开销增大。
同理你应该考虑使用`shallowReactive`而不是`reactive`。

另见

- [vue.js shallowRef](https://vuejs.org/api/reactivity-advanced.html#shallowref)
- [vue.js 减少大型不可变数据的响应性开销](https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)

## 响应式变量的创建与解构

### MaybeRefOrGetter | toValue

在`vue`与`vueuse`中，采用了大量的响应式变量传参，当参数类型为`MaybeRefOrGetter`时，
hook函数内部会通过`toValue`获取变量值以确保符合vue的响应式要求。

```ts
type MaybeRefOrGetter<T> = Ref<T> | (() => T) | T;

function toValue<T>(value: MaybeRefOrGetter<T>): T;

toValue(1); //       --> 1
toValue(ref(1)); //  --> 1
toValue(() => 1); // --> 1
```

### MaybeRefOrAsyncGetter | toAwaitValue

在`CesiumVueUse`中，因考虑到与异步数据的深度融合，我们进一步加强了`MaybeRefOrGetter`的用法，
实现了一个名为`MaybeRefOrAsyncGetter`的类型以及`toAwaitValue`方法，搭配vueuse的`computedAsync`使异步数据在vue响应式设计中更便捷使用。

```ts
export type MaybeAsyncGetter<T> = () => Promise<T> | T;
export type MaybeRefOrAsyncGetter<T> = MaybeRef<T> | MaybeAsyncGetter<T>;
function toAwaitValue<T>(value: MaybeRefOrAsyncGetter<T>): Promise<T>;

toAwaitValue(1);
toAwaitValue(ref(1));
toAwaitValue(async () => fn()); // --> Promise<T>

const value = componentAsync(() => toAwaitValue(any));
```
