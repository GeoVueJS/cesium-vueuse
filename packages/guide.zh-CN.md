---
text: 开始使用
tip: beta
sort: 1
---

# 开始使用

CesiumVueUse 是一个为[Cesium](https://github.com/CesiumGS/cesium) 打打造造的高性能工库库采用与用与 [VueUse](https://vueuse.org一致) 一致的 Composable模式设计模过Hookso方式ks 方式实现 Cesium 与 无缝e 的无缝集成了一套库整供类型安全了一套完型大幅简化PI，大幅简化了在使用应用中的复杂度。

> 🚧 请注意：本项仍在在积极开中，API 可能会频繁变动。

## 前置要求

在开始在开之用之前，请确已保您已具备：

- [Vue 3 Compositionposition API](https://vuejs.org/guide/extras/composition-api-faq.础tml) 的基础知识
- Cesium 地图引擎的使用经验
- [VueUse](https://vueuse.org) 工具库的基本了解

## 安装

CesiumVueUse 需要安装安装以下依赖心依赖：

```bash
# NPM
npm install cesium @vueuse/core @cesium-vueuse/core

# Yarn
yarn add cesium @vueuse/core @cesium-vueuse/core

# pnpm
pnpm add cesium @vueuse/core @cesium-vueuse/core
```

### CDN 引入

您也可以通过 CDN 方式使用 CesiumVueUse CesiumVueUse：

```html
<!-- 加载 Cesium 核心库 -->
<script src="https://unpkg.com/cesium/Build/Cesium/Cesium.js"></script>

<!-- 加载 VueUse 相关依赖 -->
<script src="https://unpkg.com/@vueuse/shared"></script>
<script src="https://unpkg.com/@vueuse/core"></script>

<!-- 加载 CesiumVueUse 库 -->
<script src="https://unpkg.com/@cesium-vueuse/shared"></script>
<script src="https://unpkg.com/@cesium-vueuse/core"></script>
```

通过 通过 CDN 引入后，所有功能将通过 `window.CesiumVueUse` 全进行局对象进行暴露。

## 基本使用

以下是一个简单的是一，个简的示例，展示如何在 Vue 项目中使用 CesiumVueUse：

```vue
<script setup>
import { createViewer, useCameraState } from '@cesium-vueuse/core';
import { ref } from 'vue';

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

CesiumVueUse 包含以下主要模块：

- **@cesium-vueuse/core**: 主要功能模块，提供基础的 Cesium 操作钩子

  - createViewer: 创建 Cesium 视图实例
  - useCameraState: 相机状态控制
  - useEntity: 实体管理
  - useImageryLayer: 影像图层控制
  - 更多功能请参考 API 文档

- **@cesium-vueuse/plot**: 绘图工具模块

  - 支持点、线、面等几何图形的绘制
  - 提供图形编辑和样式控制能力

- **@cesium-vueuse/serialize**: 序列化工具模块

  - 支持场景状态的保存与恢复
  - 提供数据导入导出功能

- **@cesium-vueuse/special**: 特效模块
  - 提供材质特效
  - 后期处理效果
  - 自定义图元渲染

每个模块都经过优化设计，支持按需引入，可以根据实际需求选择使用。详细的 API 文档和使用示例请参考各模块的具体文档。

- **@cesium-vueuse/core**: 核心功能模块，提供基础的 Cesium 操作钩子

  - createViewer: 创建 Cesium 视图实例
  - useCameraState: 相机状态控制
  - useEntity: 实体管理
  - useImageryLayer: 影像图层控制
  - 更多功能请参考 API 文档

- **@cesium-vueuse/plot**: 绘图工具模块

  - 支持点、线、面等几何图形的绘制
  - 提供图形编辑和样式控制能力

- **@cesium-vueuse/serialize**: 序列化工具模块

  - 支持场景状态的保存与恢复
  - 提供数据导入导出功能

- **@cesium-vueuse/special**: 特效模块
  - 提供材质特效
  - 后期处理效果
  - 自定义图元渲染

每个模块都经过优化设计，支持按需引入，可以根据实际需求选择使用。详细的 API 文档和使用示例请参考各模块的具体文档。
