import { fileURLToPath } from 'node:url';
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerAttributifyJsx,
} from 'unocss';
import { generateIconCollection } from './internals/svg-icon';

const customIconPath = fileURLToPath(new URL('./icons', import.meta.url));

export default defineConfig({
  transformers: [transformerAttributifyJsx()],
  presets: [
    presetUno({}),
    presetAttributify({
      prefix: 'un-',
      ignoreAttributes: ['icon-class'],
    }),
    presetIcons({
      autoInstall: true,
      collections: {
        custom: generateIconCollection(customIconPath, { multiColor: true, varPrefix: 'custom' }),
      },
    }),
  ],
});
