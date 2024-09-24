import type { SvgTransformOptions } from './svg-transform';

import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';

import { svgTransform } from './svg-transform';

export { svgTransform } from './svg-transform';

/**
 * unocss/unplugin-icons自定义icon工具类
 * @param dir
 * @param options
 */
export function generateIconCollection(dir: string, options?: SvgTransformOptions) {
  return FileSystemIconLoader(dir, svg => svgTransform(svg, options));
}
