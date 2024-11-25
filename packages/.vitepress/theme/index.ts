// https://vitepress.dev/guide/custom-theme

import Theme from 'vitepress/theme';
import { h } from 'vue';
import HomeHeroImage from './components/home-hero-image.vue';
import 'uno.css';
import './theme.css';
import '@unocss/reset/tailwind.css';

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      'home-hero-image': () => h(HomeHeroImage),
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  // enhanceApp(ctx: EnhanceAppContext) {

  // },
};
