<script setup lang="ts">
import { PlottedPointAction, usePlotted } from '@cesium-vueuse/plotted';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';

const { execute } = usePlotted();

watchEffect(() => {
  execute({
    scheme: {
      type: 'LineString',
      complete: packable => packable.positions!.length >= 5,
      completeOnDoubleClick: packable => packable.positions!.length >= 2,
      controlPoint: {
        format: packable => packable.positions ?? [],
        render: ({ position, status, action }) => {
          return {
            position,
            point: {
              pixelSize: 10,
              color: action === PlottedPointAction.HOVER ? Cesium.Color.RED : Cesium.Color.BLUE,
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
