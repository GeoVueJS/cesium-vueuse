import { fileURLToPath } from 'node:url';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import Icons from 'unplugin-icons/vite';
import { svgTransform } from '../svg-icon';

export function InternalPluginIcon() {
  const iconPath = fileURLToPath(new URL('../../vue/icon/svg', import.meta.url));

  return Icons({
    autoInstall: false,
    customCollections: {
      wicon: FileSystemIconLoader(iconPath, (svg) => {
        return svgTransform(svg, { multiColor: true, varPrefix: 'wicon' });
      }),
    },
  });
}
