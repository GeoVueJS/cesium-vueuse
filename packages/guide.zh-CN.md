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
