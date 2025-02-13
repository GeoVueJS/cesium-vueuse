import { fileURLToPath, URL } from 'node:url';
import { getPackageInfo } from 'local-pkg';
import UnoCSS from 'unocss/vite';
import UnpluginCesium from 'unplugin-cesium/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import Cdn from 'vite-plugin-cdn-import';
import VueDevTools from 'vite-plugin-vue-devtools';

const CESIUM_VERSION = (await getPackageInfo('cesium'))!.version;

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      UnpluginCesium({
        copyStaticFiles: false,
        cesiumBaseUrl: `https://cdn.jsdelivr.net/npm/cesium@${CESIUM_VERSION}/Build/Cesium/`,
      }),
      VueDevTools(),
      UnoCSS(),
      Components({
        dirs: fileURLToPath(new URL('./theme/components', import.meta.url)),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: fileURLToPath(new URL('./components.d.ts', import.meta.url)),
      }),
      ...(mode === 'build'
        ? [
            Cdn({
              modules: [
                'vue',
                'vue-router',
                {
                  name: 'pinia',
                  var: 'Pinia',
                  path: `/dist/pinia.iife.prod.js`,
                },
                {
                  name: 'cesium',
                  var: 'Cesium',
                  path: `/Build/Cesium/Cesium.min.js`,
                },
              ],
            }),
          ]
        : []),
    ],
    server: { port: 9574 },
    publicDir: '.vitepress/public',
  };
});
