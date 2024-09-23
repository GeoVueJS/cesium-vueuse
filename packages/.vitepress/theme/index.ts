// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme';
import { h } from 'vue';
import 'uno.css';

import '@unocss/reset/tailwind.css';

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  // enhanceApp({ app, router, siteData }) {
  // },
};
