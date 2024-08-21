import { URL, fileURLToPath } from 'node:url';

import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import VueDevTools from 'vite-plugin-vue-devtools';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueJsx(),
    VueDevTools(),
    UnoCSS(),
    Components({
      dirs: fileURLToPath(new URL('./theme/components', import.meta.url)),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [ElementPlusResolver()],
      dts: fileURLToPath(new URL('./theme/components.d.ts', import.meta.url)),
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: fileURLToPath(new URL('./theme/auto-imports.d.ts', import.meta.url)),
    }),
  ],
  server: {
    port: 33333,
  },
  ssr: {
    noExternal: ['element-plus'],
  },
});
