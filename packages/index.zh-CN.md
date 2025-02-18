---

# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Vesium"
  text: "Vue 3 与 Cesium 的优雅集成方案"
  tagline: 基于 Composition API 的高性能地图可视化解决方案
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide

    - theme: alt
      text: 最佳实践
      link: /zh/note

features:
  - icon:
      src: /icon-ts.svg
    title: 类型完备
    details: 基于 TypeScript 构建，提供完整类型推导和智能提示支持

  - icon:
      src: /icon-rainbow.svg
    title: API 覆盖全面
    details: 全面封装 Cesium API，支持所有核心功能调用

  - icon:
      src: /icon-vueuse.svg
    title: 响应式支持
    details: 深度集成 Vue 3 响应式系统，支持 ref、getter 等响应式数据传递

  - icon:
      src: /icon-smiling.svg
    title: 自动资源管理
    details: 智能的生命周期管理，组件销毁时自动清理 Cesium 资源，防止内存泄漏

  - icon:
      src: /icon-tree.svg
    title: 按需引入
    details: 支持 Tree Shaking，只打包使用到的功能，优化应用体积

  - icon:
      src: /icon-plugin.svg
    title: 扩展生态
    details: 提供丰富的插件系统，支持自定义扩展功能
---
