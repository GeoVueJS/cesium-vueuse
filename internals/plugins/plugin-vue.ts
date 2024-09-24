import type { PluginOption } from 'vite';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import AutoComponents from 'unplugin-vue-components/vite';
import { InternalPluginCss } from './plugin-css';

import { InternalPluginIcon } from './plugin-icon';

export function InternalPluginVue(): PluginOption[] {
  return [
    Vue(),
    AutoImport({
      dts: false,
      resolvers: [ElementPlusResolver()],
    }),
    AutoComponents({
      dts: false,
      resolvers: [ElementPlusResolver()],
    }),
    InternalPluginCss(),
    InternalPluginIcon(),
  ];
}
