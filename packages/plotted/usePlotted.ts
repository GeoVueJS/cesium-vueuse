import type { Viewer } from 'cesium';
import type { Ref } from 'vue';

export interface UsePlottedOptions {
}

export interface UsePlottedRetrun {
  add: Function;
  remove: Function;
  records: any;
  active: any;
  ongoing: Ref<boolean>;
}

const collection: WeakMap<Viewer, Map<string, any>> = new WeakMap();

export function usePlotted(options?: UsePlottedOptions): UsePlottedRetrun | undefined {
  const add = () => {};
}
