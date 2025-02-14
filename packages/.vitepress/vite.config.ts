import { fileURLToPath, URL } from 'node:url';
import UnoCSS from 'unocss/vite';
import UnpluginCesium from 'unplugin-cesium/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import VueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  plugins: [
    UnpluginCesium(),
    VueDevTools(),
    UnoCSS(),
    Components({
      dirs: fileURLToPath(new URL('./theme/components', import.meta.url)),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: fileURLToPath(new URL('./components.d.ts', import.meta.url)),
    }),
  ],
  server: { port: 9574 },
  publicDir: '.vitepress/public',
  build: {
    rollupOptions: {
      external: [
        'cesium',
      ],
    },
  },
});
