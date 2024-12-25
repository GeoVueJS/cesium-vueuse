import type { Entity, JulianDate } from 'cesium';
import type { ShallowRef } from 'vue';
import type { PlottedProduct } from './PlottedProduct';
import { useCesiumEventListener, useDataSource, useEntityScope } from '@cesium-vueuse/core';
import { CustomDataSource } from 'cesium';

export interface UseScaffoldOptions {
}

export interface UseScaffoldRetrun {
}

export function useScaffold(
  current: ShallowRef<PlottedProduct | undefined>,
  getCurrentTime: () => JulianDate,
): void {
  const dataSource = useDataSource(new CustomDataSource());
  const entityScope = useEntityScope({ collection: () => dataSource.value!.entities });

  let altitude: Entity[] = [];
  let auxiliary: Entity[] = [];
  let control: Entity[] = [];
  let height: Entity[] = [];
  let moved: Entity[] = [];

  useCesiumEventListener(
    () => [
      current.value?.statusChanged,
      current.value?.smaple.definitionChanged,
    ],
    () => {
      if (!current.value) {
        return;
      }
      const { altitudePoint, auxiliaryPoint, controlPoint, heightPoint, movedPoint } = current.value.scheme;
      const packable = current.value?.smaple.getValue(getCurrentTime());
      const status = current.value?.status;
      altitude = altitudePoint?.(packable, status, altitude) ?? [];
      auxiliary = auxiliaryPoint?.(packable, status, auxiliary) ?? [];
      control = controlPoint?.(packable, status, control) ?? [];
      height = heightPoint?.(packable, status, height) ?? [];
      moved = movedPoint?.(packable, status, moved) ?? [];

      const entities = [...altitude, ...auxiliary, ...control, ...height, ...moved];
      entityScope.removeWhere(entity => !entities.includes(entity));
      entities.forEach(entity => entityScope.add(entity));
    },
  );
}
