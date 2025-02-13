// https://vitepress.dev/guide/custom-theme

import { defineClientComponent } from 'vitepress';
import Theme from 'vitepress/theme';
import { h } from 'vue';
import 'uno.css';
import './styles/theme.css';
import '@unocss/reset/tailwind.css';

const HomeHeroBefore = defineClientComponent(() => import('./components/home-hero-image.vue'));

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      'home-hero-before': () => h(HomeHeroBefore),
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  // enhanceApp(ctx: EnhanceAppContext) {

  // },
};
