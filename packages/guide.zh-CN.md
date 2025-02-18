---
text: 开始使用
sort: 1
---

# 开始使用

Vesium 是一个为 [Cesium](https://github.com/CesiumGS/cesium) 打造的高性能库，采用与 [VueUse](https://vueuse.org) 一致的 Composable 模式设计，通过 Hooks 方式实现 Cesium 的无缝集成，提供类型安全的 API，大幅简化了在 Vue 应用中使用 Cesium 的复杂度。

> 🚧 **请注意**：本项目仍在积极开发中，API 可能会频繁变动。

## 前置要求

在开始使用之前，请确保您已具备以下条件：

- [Cesium](https://cesium.com/) 地图引擎的使用经验
- [Vue3 Composition API](https://cn.vuejs.org/guide/extras/composition-api-faq) 的基础知识
- [VueUse](https://vueuse.org) 工具库的基本了解

## 安装

### 使用包管理器安装

```bash
# NPM
npm install cesium @vueuse/core @vesium/core

# Yarn
yarn add cesium @vueuse/core @vesium/core

# pnpm
pnpm add cesium @vueuse/core @vesium/core
```

### 使用 CDN 引入

您也可以通过 CDN 方式使用 Vesium：

```html
<!-- 加载 Cesium 核心库 -->
<script src="https://unpkg.com/cesium/Build/Cesium/Cesium.js"></script>

<!-- 加载 VueUse 相关依赖 -->
<script src="https://unpkg.com/@vueuse/shared"></script>
<script src="https://unpkg.com/@vueuse/core"></script>

<!-- 加载 Vesium 库 -->
<script src="https://unpkg.com/@vesium/shared"></script>
<script src="https://unpkg.com/@vesium/core"></script>
```

通过 CDN 引入后，所有功能将通过 `window.Vesium` 全局对象进行暴露。

## 基本使用

以下是一个简单的示例，展示如何在 Vue 项目中使用 Vesium：

```vue
<script setup>
import { createViewer, useCameraState } from '@vesium/core';
import { ref, watch } from 'vue';

// 创建容器引用
const cesiumContainer = ref(null);

// 创建 Cesium Viewer 实例
const viewer = createViewer(cesiumContainer);

// 使用相机控制钩子
const { position, heading, pitch, roll } = useCameraState(viewer);

// 监听相机位置变化
watch(position, (newPosition) => {
  console.log('相机位置已更新:', newPosition);
});
</script>

<template>
  <div ref="cesiumContainer" style="width: 100%; height: 100%" />
</template>
```

## 模块说明

Vesium 包含以下主要模块：

- **@vesium/core**: 主要功能模块，提供基础的 Cesium 操作钩子

  - `createViewer`: 创建 Cesium 视图实例
  - `useCameraState`: 相机状态控制
  - `useEntity`: 实体管理
  - `useImageryLayer`: 影像图层控制
  - 更多功能请参考 API 文档

- **@vesium/plot**: 绘图工具模块

  - 支持点、线、面等几何图形的绘制
  - 提供图形编辑和样式控制能力

- **@vesium/serialize**: 序列化工具模块

  - 支持场景状态的保存与恢复
  - 提供数据导入导出功能

- **@vesium/special**: 特效模块
  - 提供材质特效
  - 后期处理效果
  - 自定义图元渲染

每个模块都经过优化设计，支持按需引入，可以根据实际需求选择使用。详细的 API 文档和使用示例请参考各模块的具体文档。
