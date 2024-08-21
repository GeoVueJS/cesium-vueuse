import { URL, fileURLToPath } from 'node:url';

import demoBlock from 'markdown-it-vitepress-demo';
import { defineConfig } from 'vitepress';
import { generateSidebar } from 'vitepress-sidebar';

const sidebar = generateSidebar([
  {
    documentRootPath: './packages',
    scanStartPath: './',
    resolvePath: '',
    useFolderLinkFromIndexFile: true,
  },
]);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './',
  vite: { configFile: fileURLToPath(new URL('vite.config.ts', import.meta.url)) },
  title: 'Cesium VueUse',
  description: 'A VitePress Site',
  rewrites: {
  },
  markdown: {
    config(md) {
      md.use(demoBlock);
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
    ],
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
});
