import { fileURLToPath, URL } from 'node:url';

import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import VueDevTools from 'vite-plugin-vue-devtools';

const root = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium/'),
  },
  plugins: [
    VueDevTools(),
    UnoCSS(),
    Components({
      dirs: fileURLToPath(new URL('./theme/components', import.meta.url)),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver(),
      ],
      dts: fileURLToPath(new URL('./components.d.ts', import.meta.url)),

    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: fileURLToPath(new URL('./auto-imports.d.ts', import.meta.url)),
    }),
    viteStaticCopy({
      targets: [
        {
          src: `${root}/node_modules/cesium/Build/Cesium/Workers/**`,
          dest: 'cesium/Workers',
        },
        {
          src: `${root}/node_modules/cesium/Build/Cesium/ThirdParty/**`,
          dest: 'cesium/ThirdParty',
        },
        {
          src: `${root}/node_modules/cesium/Build/Cesium/Assets/**`,
          dest: 'cesium/Assets',
        },
        {
          src: `${root}/node_modules/cesium/Build/Cesium/Widgets/**`,
          dest: 'cesium/Widgets',
        },

      ],
    }),
  ],
  server: {
    port: 33333,
  },
  ssr: {
    noExternal: ['element-plus'],
  },
});
