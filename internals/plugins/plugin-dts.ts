import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';

/**
 * build typescript definition file
 *
 * @param root The path of the root directory
 * @param output The path of the output directory
 * @param bundle Whether to bundle the type definition files
 */
export function InternalPluginDts(root: string, output: string, bundle?: boolean) {
  return dts({
    tsconfigPath: fileURLToPath(new URL('./tsconfig.build.json', import.meta.url)),
    rollupTypes: bundle,
    strictOutput: true,
    staticImport: true,
    logLevel: 'silent',
    root,
    pathsToAliases: false,
    outDir: output,
    include: [`${root}/**/*.ts`, `${root}/**/*.tsx`, `${root}/**/*.vue`],
    exclude: [`**/dist/**`, `**/node_modules/**`],
  });
}
