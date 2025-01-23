import type { Viewer } from 'cesium';
import { reactive } from 'vue';
import { useViewer } from '../useViewer';

const disabledSymbols = reactive(new Map<Viewer, number>());

export function useDemo(options?: DemoOptions): DemoRetrun | undefined {
  const viewer = useViewer();

  const requestToDisable = () => {
    let value = disabledSymbols.get(viewer.value!) || 0;
    value++;
    disabledSymbols.set(viewer.value!, value);
  };
}
