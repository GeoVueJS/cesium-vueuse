---
text: Getting Started
tip: beta
sort: 1
---

# Getting Started

CesiumVueUse is a high-performance utility library built for [Cesium](https://github.com/CesiumGS/cesium), following the same Composables design pattern as [VueUse](https://vueuse.org). It achieves seamless integration between Cesium and Vue through Hooks. The library provides a complete set of type-safe APIs that significantly simplify the complexity of using Cesium in Vue applications.

> 🚧 Note: This project is under active development, and the API may change frequently.

## Prerequisites

Before getting started, please ensure you have:

- Basic knowledge of [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- Experience with Cesium map engine
- Basic understanding of [VueUse](https://vueuse.org) library

## Installation

CesiumVueUse requires the following core dependencies:

```bash
# NPM
npm install cesium @vueuse/core @cesium-vueuse/core

# Yarn
yarn add cesium @vueuse/core @cesium-vueuse/core

# pnpm
pnpm add cesium @vueuse/core @cesium-vueuse/core
```

### CDN Usage

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

After importing via CDN, all functionality will be exposed through the `window.CesiumVueUse` global object.

## Basic Usage

Here's a simple example showing how to use CesiumVueUse in a Vue project:

```vue
<script setup>
import { createViewer, useCameraState } from '@cesium-vueuse/core';
import { ref } from 'vue';

// Create container reference
const cesiumContainer = ref(null);

// Create Cesium Viewer instance
const viewer = createViewer(cesiumContainer);

// Use camera control hook
const { position, heading, pitch, roll } = useCameraState(viewer);

// Watch camera position changes
watch(position, (newPosition) => {
  console.log('Camera position updated:', newPosition);
});
</script>

<template>
  <div ref="cesiumContainer" style="width: 100%; height: 100%" />
</template>
```

## Module Description

CesiumVueUse includes the following main modules:

- **@cesium-vueuse/core**: Core functionality module, providing basic Cesium operation hooks

  - createViewer: Create Cesium viewer instance
  - useCameraState: Camera state control
  - useEntity: Entity management
  - useImageryLayer: Imagery layer control
  - More features in API documentation

- **@cesium-vueuse/plot**: Drawing tools module

  - Supports drawing points, lines, polygons, and other geometric shapes
  - Provides shape editing and style control capabilities

- **@cesium-vueuse/serialize**: Serialization tools module

  - Supports scene state saving and restoration
  - Provides data import and export functionality

- **@cesium-vueuse/special**: Special effects module
  - Provides material effects
  - Post-processing effects
  - Custom primitive rendering

Each module is optimized for design and supports tree-shaking, allowing you to import only what you need based on your requirements. For detailed API documentation and usage examples, please refer to the specific documentation for each module.
