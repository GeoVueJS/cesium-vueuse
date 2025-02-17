<p align="center">
<img src="./assets/logo.svg" align="center" width="15%" />
</p>

<h1 align="center">Vesium</h1>

<p align="center">Cesium hooks like VueUse api.</p>

<p align="center">
<a href="https://www.npmjs.com/package/@vesium/core" target="__blank"><img src="https://img.shields.io/npm/v/@vesium/core?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/@vesium/core" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vesium/core?color=50a36f&label="></a>
<a href="https://github.com/GeoVueJS/vesium" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/GeoVueJS/vesium?style=social"></a>
</p>

> 🚧 This project is under development, and the API may change frequently.

## Features

- 🎯 **Intuitive** - VueUse-style API design, familiar to Vue developers
- 💪 **Type Strong** - Written in TypeScript, with full TS support
- 🏪 **Modular** - Tree-shakeable ESM modules
- 🌐 **Full Featured** - Comprehensive Cesium functionality support
- 🎮 **Interactive** - Rich interactive capabilities with map elements
- ⚡️ **Lightweight** - No bloated dependencies

## Packages

| Package                                    | Version                                                                                                       | Description                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------- |
| [@vesium/core](./packages/core/)           | [![npm](https://img.shields.io/npm/v/@vesium/core.svg)](https://www.npmjs.com/package/@vesium/core)           | Core functionalities        |
| [@vesium/plot](./packages/plot/)           | [![npm](https://img.shields.io/npm/v/@vesium/plot.svg)](https://www.npmjs.com/package/@vesium/plot)           | Drawing & plotting tools    |
| [@vesium/serialize](./packages/serialize/) | [![npm](https://img.shields.io/npm/v/@vesium/serialize.svg)](https://www.npmjs.com/package/@vesium/serialize) | State serialization         |
| [@vesium/special](./packages/special/)     | [![npm](https://img.shields.io/npm/v/@vesium/special.svg)](https://www.npmjs.com/package/@vesium/special)     | Special effects & materials |

## Install

```bash
# npm
npm i cesium @vueuse/core vesium

# yarn
yarn add cesium @vueuse/core vesium

# pnpm
pnpm add cesium @vueuse/core vesium
```

<template>
  <div ref="cesiumContainer" style="width: 100%; height: 100%" />
</template>
```

## 🌸 Credits

- [VueUse](https://github.com/vueuse/vueuse) - Collection of Vue Composition Utilities
- [Cesium](https://github.com/CesiumGS/cesium) - An open-source JavaScript library for world-class 3D globes and maps

## 📄 License

[MIT](./LICENSE) License © 2024 [GeoVueJS](https://github.com/GeoVueJS)
