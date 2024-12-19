<script setup lang="ts">
import { usePlotted } from '@cesium-vueuse/plotted';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';

const { execute } = usePlotted();

watchEffect(() => {
  execute({
    scheme: {
      type: 'LineString',
      complete: positions => positions.length >= 5,
      completeOnDoubleClick: positions => positions.length >= 2,
      render(options) {
        const { mouse, packable, status } = options;
        const entity
        = options.prev.entities?.[0]
        ?? new Cesium.Entity({
          polyline: {
            width: 1,
          },
        });
        entity.polyline!.positions = new Cesium.CallbackProperty((time) => {
          const positions = [...packable.positions ?? []].concat(mouse ? [mouse] : []);
          // console.log(positions);
          if (positions.length >= 2) {
            return positions;
          }
          else {
            return [];
          }
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
