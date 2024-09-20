<script lang="ts" setup>
import { useEntity } from '../useEntity';

useEntity(() => {
  return new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(110, 20, 100),
    point: {
      pixelSize: 10,
      color: Cesium.Color.RED,
    },
  });
});
</script>
