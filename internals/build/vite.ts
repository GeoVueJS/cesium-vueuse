import type { OutputOptions } from 'rollup';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { minify } from 'rollup-plugin-esbuild';
import { build as viteBuild } from 'vite';
import { InternalPluginDts } from '../plugins/plugin-dts';
import { InternalPluginVue } from '../plugins/plugin-vue';

/**
 * Build构造参数
 */
export interface BuildOptions {
  root: string;
  name: string;
  /**
   * 是否保留模块结构, true则捆绑到同一个文件中
   */
  bundle: boolean;
  dependencies: string[];
  pkg: Record<string, any>;
}

export async function build(options: BuildOptions, externalPackageMap: Record<string, string>) {
  const { root, bundle } = options;

  // 生成 external 所要使用的函数
  function getRollupExternal(id: string): boolean {
    const pkg = options.pkg;
    const dependencies = Object.keys(pkg.dependencies ?? {}).filter(e => !e.startsWith('@types/'));
    const lib = dependencies.find(e => id.startsWith(e));
    return !!lib || id === 'vue';
  }

  function getRollupGlobals(id: string): string {
    const pkg = options.pkg;
    const dependencies = Object.keys(pkg.dependencies ?? {}).filter(e => !e.startsWith('@types/'));

    const symbol = dependencies.find(e => id.startsWith(e));

    if (!symbol) {
      throw new Error(`[${pkg.name}] \`dependencies\`中不存在${id}`);
    }
    const globalName = externalPackageMap[symbol];
    if (!globalName) {
      throw new Error(`[${pkg.name}] meta.libNames中不满足${globalName}`);
    }
    return globalName;
  }

  // eslint-disable-next-line no-console
  console.log(options.name, ':', root);
  const output = path.join(root, 'dist');
  try {
    fs.rmSync(output, { recursive: true });
  }
  catch {}

  // 根据捆绑类型获取输出路径
  const outputDir = (type: 'es' | 'cjs' | 'bundle') => {
    if (options.bundle) {
      return output;
    }
    return path.join(output, type === 'bundle' ? 'dist' : type === 'cjs' ? 'lib' : 'es');
  };

  const sharedOptions: OutputOptions = {
    validate: true,
    exports: 'named',
  };

  await viteBuild({
    root,
    plugins: [
      bundle && InternalPluginDts(root, outputDir('bundle'), true),
      !bundle && InternalPluginDts(root, outputDir('cjs'), false),
      !bundle && InternalPluginDts(root, outputDir('es'), false),
      !bundle && InternalPluginVue(),
    ],
    optimizeDeps: {
      exclude: ['cesium'],
    },
    build: {
      minify: false,
      reportCompressedSize: false,
      cssCodeSplit: true,
      sourcemap: true,
      lib: {
        entry: './index.ts',
        name: options.name,
      },

      rollupOptions: {
        external: getRollupExternal,
        output: [
          // ====捆绑不压缩=====
          {
            ...sharedOptions,
            format: 'iife',
            preserveModules: false,
            name: options.name,
            globals: getRollupGlobals,
            dir: outputDir('bundle'),
            entryFileNames: `[name].js`,
          },
          {
            ...sharedOptions,
            format: 'es',
            preserveModules: false,
            dir: outputDir('bundle'),
            entryFileNames: `[name].mjs`,
          },
          {
            ...sharedOptions,
            format: 'cjs',
            preserveModules: false,
            dir: outputDir('bundle'),
            entryFileNames: `[name].cjs`,
          },

          // ====捆绑并压缩=====
          {
            ...sharedOptions,
            format: 'iife',
            compact: true,
            preserveModules: false,
            name: options.name,
            globals: getRollupGlobals,
            dir: outputDir('bundle'),
            entryFileNames: `[name].min.js`,
            plugins: [minify({ sourceMap: true })],
          },
          {
            ...sharedOptions,
            format: 'es',
            compact: true,
            preserveModules: false,
            dir: outputDir('bundle'),
            entryFileNames: `[name].min.mjs`,
            plugins: [minify({ sourceMap: true })],
          },
          {
            ...sharedOptions,
            format: 'cjs',
            compact: true,
            preserveModules: false,
            dir: outputDir('bundle'),
            entryFileNames: `[name].min.cjs`,
            plugins: [minify({ sourceMap: true })],
          },

          // ====不捆绑====
          ...((!bundle
            ? [
                {
                  ...sharedOptions,
                  format: 'es',
                  preserveModules: true,
                  dir: outputDir('es'),
                  entryFileNames: `[name].mjs`,
                },
                {
                  ...sharedOptions,
                  format: 'cjs',
                  preserveModules: true,
                  dir: outputDir('cjs'),
                  entryFileNames: `[name].cjs`,
                },
              ]
            : []) as OutputOptions[]),
        ],
      },
    },
  });
}
