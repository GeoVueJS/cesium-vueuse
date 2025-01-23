<script setup lang="ts">
import { useViewer } from '@cesium-vueuse/core';
import { usePlot } from '@cesium-vueuse/plot';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';
import { control } from '../skeleton/control';
import { intervalNonclosed } from '../skeleton/intervalNonclosed';
import { moved } from '../skeleton/moved';

const { operate } = usePlot();

watchEffect(() => {
  operate({
    scheme: {
      type: 'LineString',
      complete: packable => packable.positions!.length >= 3,
      forceComplete: packable => packable.positions!.length >= 2,
      skeletons: [
        control,
        intervalNonclosed,
        moved,
      ],
      render(options) {
        const { mouse, packable } = options;
        const entity = options.previous.entities?.[0]
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
const viewer = useViewer();
</script>

<template>
</template>
