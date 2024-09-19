import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vitepress';

import { markdownDemoContainer } from './plugins/demoContainer';
import { generateSidebar } from './utils/generateSidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './',
  vite: { configFile: fileURLToPath(new URL('vite.config.ts', import.meta.url)) },
  title: 'Cesium VueUse',
  description: 'A VitePress Site',
  rewrites: {
    '(.*).zh-CN.md': 'zh/(.*).md',
  },
  markdown: {
    config(md) {
      md.use(markdownDemoContainer);
    },
  },
  locales: {
    root: {
      link: '/',
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide' },
        ],
        sidebar: generateSidebar({
          base: '/',
          filter: path => path.split('.').length === 2 && path.endsWith('.md') && !path.startsWith('index'),
        }),

      },
    },
    zh: {
      link: '/zh',
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh' },
          { text: '引导', link: '/zh/guide' },
        ],
        sidebar: generateSidebar({
          base: '/zh',
          filter: path => path.endsWith('.zh-CN.md'),
        }),

      },
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
});
