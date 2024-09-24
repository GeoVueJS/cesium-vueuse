import path from 'node:path';
import FastGlob from 'fast-glob';
import { normalizePath } from 'vite';
import { getPkgJSON } from './utils';
import { build } from './vite';

/**
 * 读取所有子包的package.json所在目录
 */
const pkgFilePaths = FastGlob.sync(`./{packages,vue}/*/package.json`, {
  absolute: true,
  onlyFiles: true,
  ignore: ['node_modules', 'dist', '.vitepress'],
});

const packages = pkgFilePaths.map((filePath) => {
  const pkg = getPkgJSON(filePath);
  const dependencies = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
  return {
    root: normalizePath(path.resolve(filePath, '../')),
    name: pkg.buildInfo.name,
    bundle: !!pkg.buildInfo.bundle,
    dependencies,
    pkg,
  };
});

/**
 * 不打包进去的依赖
 */
const externalPackageMap: Record<string, string> = {
  'vue': 'Vue',
  'cesium': 'Cesium',
  '@vueuse/core': 'VueUse',
  '@vueuse/shared': 'Vueuse',

  ...packages.reduce((obj: Record<string, string>, item: any) => {
    obj[item.pkg.name] = item?.name;
    return obj;
  }, {} as Record<string, string>),
};

for (const options of packages) {
  await build(options, externalPackageMap);
}
