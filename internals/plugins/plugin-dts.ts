import { fileURLToPath } from 'node:url';

import dts from 'vite-plugin-dts';

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
