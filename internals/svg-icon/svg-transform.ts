import svgo from 'svgo';

export interface SvgTransformOptions {
  /**
   * 若图标为多色图标，是否启用多css颜色变量注入
   * @default true
   */
  multiColor?: boolean;

  /**
   * css颜色变量注入的前缀，仅在multiColor===true时生效
   * 将生成 --icon-${varPrefix}-color-${index}
   * @default custom
   */
  varPrefix?: string;
}

/**
 * SVG图标转换工具类
 * @param svg
 * @param options
 */
export function svgTransform(svg: string, options?: SvgTransformOptions): string {
  const varPrefix = options?.varPrefix ?? 'custom';
  const multiColor = options?.multiColor ?? true;

  svg = svgo.optimize(svg, {
    plugins: [
      'removeDimensions',
      'convertColors',
      'cleanupIds',
      'reusePaths',
      'convertStyleToAttrs',
    ],
  }).data;
  let colors: string[] = svg.match(/((#\w{3,8}))/g) ?? [];
  colors = colors.map(e => e.toLocaleUpperCase());
  colors = [...new Set(colors)];
  if (colors.length <= 1) {
    svg = svg.replace(colors[0], 'currentColor');
    svg = svg.replace(/^<svg /, '<svg fill="currentColor" ');
  }

  if (multiColor && colors.length > 1) {
    colors = colors.sort(); // 进行排序，确保接近一致的不同svg之间的变量索引注入保持一致的
    colors.forEach((color, index) => {
      svg = svg.replaceAll(new RegExp(`(${color})(\\W)`, 'gi'), ($0, $1, $2) => {
        return `var(--icon-${varPrefix}-color-${index},${color})${$2}`;
      });
    });
  }
  return svg;
}
