import type { Plugin } from 'vite';
import path from 'node:path';
import MagicString from 'magic-string';
import { normalizePath } from 'vite';

export function InternalPluginCss(): Plugin {
  return {
    name: 'internal-plugin-css',
    apply: 'build',
    enforce: 'post',

    generateBundle(options, bundle) {
      Object.entries(bundle).forEach(([_fileName, chunk]) => {
        if (chunk.type === 'asset' || !chunk.viteMetadata) {
          return;
        }

        const { importedCss } = chunk.viteMetadata!;
        if (importedCss.size === 0) {
          return;
        }

        const code = chunk.code;
        const ms = new MagicString(code);
        for (const cssFileName of importedCss) {
          let cssFilePath = path.relative(path.dirname(chunk.fileName), cssFileName);
          cssFilePath = normalizePath(cssFilePath);
          cssFilePath = cssFilePath.startsWith('.') ? cssFilePath : `./${cssFilePath}`;
          ms.prepend(`import '${cssFilePath}';\n`);
        }
        chunk.code = ms.toString();
        chunk.map = ms.generateMap() as any;
      });
    },
  };
}
