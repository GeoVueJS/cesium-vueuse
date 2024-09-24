import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';

/**
 * build typescript definition file
 *
 * @param root 根目录路径
 * @param output 输出目录路径
 * @param bundle 是否打包类型定义文件
 */
export function InternalPluginDts(root: string, output: string, bundle?: boolean) {
  return dts({
    tsconfigPath: fileURLToPath(new URL('./tsconfig.build.json', import.meta.url)),
    rollupTypes: bundle,
    strictOutput: true,
    staticImport: true,
    logLevel: 'silent',
    compilerOptions: {
      skipLibCheck: true,
      skipDefaultLibCheck: true,
    },
    root,
    pathsToAliases: false,
    outDir: output,
    include: [`${root}/**/*.ts`, `${root}/**/*.tsx`, `${root}/**/*.vue`],
    exclude: [`**/dist/**`, `**/node_modules/**`],
  });
}
