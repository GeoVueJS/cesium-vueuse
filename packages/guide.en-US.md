---
sort: 1
---

# Getting Started

CesiumVueUse is a high-performance library designed for [Cesium](https://github.com/CesiumGS/cesium), adopting the Composable pattern consistent with [VueUse](https://vueuse.org). It integrates Cesium seamlessly using Hooks, providing type-safe APIs that significantly simplify the complexity of using Cesium in Vue applications.

> 🚧 **Note**: This project is actively under development, and the API may change frequently.

## Prerequisites

Before you start, ensure you have the following:

- Experience with the [Cesium](https://cesium.com/) mapping engine
- Basic knowledge of the [Vue 3 Composition API](https://cn.vuejs.org/guide/extras/composition-api-faq)
- Familiarity with the [VueUse](https://vueuse.org) utility library

## Installation

### Using Package Managers

```bash
# NPM
npm install cesium @vueuse/core @cesium-vueuse/core

# Yarn
yarn add cesium @vueuse/core @cesium-vueuse/core

# pnpm
pnpm add cesium @vueuse/core @cesium-vueuse/core
```

### Using CDN

You can also use CesiumVueUse via CDN:

```html
<!-- Load Cesium core library -->
<script src="https://unpkg.com/cesium/Build/Cesium/Cesium.js"></script>

<!-- Load VueUse dependencies -->
<script src="https://unpkg.com/@vueuse/shared"></script>
<script src="https://unpkg.com/@vueuse/core"></script>

<!-- Load CesiumVueUse library -->
<script src="https://unpkg.com/@cesium-vueuse/shared"></script>
<script src="https://unpkg.com/@cesium-vueuse/core"></script>
```

When using CDN, all functionalities are exposed through the global object `window.CesiumVueUse`.

## Basic Usage

Below is a simple example demonstrating how to use CesiumVueUse in a Vue project:

```vue
<script setup>
import { createViewer, useCameraState } from '@cesium-vueuse/core';
import { ref, watch } from 'vue';

// Create container reference
const cesiumContainer = ref(null);

// Create a Cesium Viewer instance
const viewer = createViewer(cesiumContainer);

// Use camera control hook
const { position, heading, pitch, roll } = useCameraState(viewer);

// Watch for camera position changes
watch(position, (newPosition) => {
  console.log('Camera position updated:', newPosition);
});
</script>

<template>
  <div ref="cesiumContainer" style="width: 100%; height: 100%" />
</template>
```

## Module Overview

CesiumVueUse includes the following main modules:

- **@cesium-vueuse/core**: Main functionality module, providing basic Cesium operation hooks

  - `createViewer`: Creates a Cesium viewer instance
  - `useCameraState`: Camera state control
  - `useEntity`: Entity management
  - `useImageryLayer`: Imagery layer control
  - For more features, refer to the API documentation

- **@cesium-vueuse/plot**: Drawing tools module

  - Supports drawing geometric shapes such as points, lines, and polygons
  - Provides capabilities for editing and styling graphics

- **@cesium-vueuse/serialize**: Serialization tools module

  - Supports saving and restoring scene states
  - Provides data import/export functionality

- **@cesium-vueuse/special**: Effects module
  - Provides material effects
  - Post-processing effects
  - Custom primitive rendering

Each module is optimized for on-demand loading and can be used based on your specific needs. For detailed API documentation and usage examples, refer to the specific module's documentation.
