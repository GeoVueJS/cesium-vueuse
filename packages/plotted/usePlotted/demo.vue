<script setup lang="ts">
import { usePlotted } from '@cesium-vueuse/plotted';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';
import { PlottedAction } from './PlottedScaffold';

const { execute } = usePlotted();

watchEffect(() => {
  execute({
    scheme: {
      type: 'LineString',
      complete: packable => packable.positions!.length >= 3,
      completeOnDoubleClick: packable => packable.positions!.length >= 2,
      controlPoint: {
        format: positions => positions ?? [],
        render: ({ position, action }) => {
          const colors = {
            [PlottedAction.IDLE]: Cesium.Color.BLUE.withAlpha(0.6),
            [PlottedAction.HOVER]: Cesium.Color.BLUE.withAlpha(0.8),
            [PlottedAction.OPERATING]: Cesium.Color.AQUA.withAlpha(0.6),
            [PlottedAction.ACTIVE]: Cesium.Color.AQUA.withAlpha(0.8),
          };
          return {
            position,
            point: {
              pixelSize: 8,
              color: colors[action],
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              outlineWidth: 1,
              outlineColor: Cesium.Color.WHITE.withAlpha(0.4),
            },
          };
        },
      },
      intervalPoint: {
        format: positions => positions ?? [],
        render: ({ position, action }) => {
          const colors = {
            [PlottedAction.IDLE]: Cesium.Color.GREEN.withAlpha(0.6),
            [PlottedAction.HOVER]: Cesium.Color.GREEN.withAlpha(0.8),
            [PlottedAction.OPERATING]: Cesium.Color.AQUA.withAlpha(0.6),
            [PlottedAction.ACTIVE]: Cesium.Color.AQUA.withAlpha(0.8),
          };
          return {
            position,
            point: {
              pixelSize: 6,
              color: colors[action],
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              outlineWidth: 1,
              outlineColor: Cesium.Color.WHITE.withAlpha(0.4),
            },
          };
        },
      },
      render(options) {
        const { mouse, packable } = options;
        const entity
        = options.prev.entities?.[0]
        ?? new Cesium.Entity({
          polyline: {
            width: 1,
          },
        });
        entity.polyline!.positions = new Cesium.CallbackProperty(() => {
          const positions = [...packable.positions ?? []].concat(mouse ? [mouse] : []);
          return positions.length >= 2 ? positions : [];
        }, false);

        return {
          entities: [entity],
        };
      },
    },
  });
});
</script>

<template>
</template>
