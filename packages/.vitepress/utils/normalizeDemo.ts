import path from 'node:path';
import { normalizePath } from 'vite';
import { VITEPRESS_ROOT } from '../root';

const AUTO_DEMO_PREFIX = 'AutoDemo_';

/**
 *  Convert path to demo component name
 *
 * `{root}/core/createViewer/demo.vue`  => `AutoDemo_core_createViewer_demo$vue`
 *
 * @param demoRealPath The real path of the example
 * @returns Convert demo component name
 */
export function demoPathToComponentName(demoRealPath: string) {
  demoRealPath = normalizePath(demoRealPath);
  const relativePath = normalizePath(path.relative(VITEPRESS_ROOT, demoRealPath));

  const demoName = `${AUTO_DEMO_PREFIX}${relativePath.replace(/\//g, '_').replace('.', '$')}`;
  return demoName;
}

/**
 *  Convert component name to path
 * `AutoDemo_core_createViewer_demo$vue`  => `{root}/core/createViewer/demo.vue`
 * @param demoName  demo component name
 * @returns The real path of the example
 */
export function componentNameTodemoPath(demoName: string) {
  const relativePath = demoName.replace(new RegExp(`^${AUTO_DEMO_PREFIX}`), '').replace(/_/g, '/').replace('$', '.');
  const demoRealPath = normalizePath(path.resolve(VITEPRESS_ROOT, relativePath));
  return demoRealPath;
}

/**
 * The `unplugin-vue-components` resolver function of `demo-component`
 */
export function DemoAutoResolver() {
  return (name: string) => {
    if (name.startsWith('AutoDemo_')) {
      const from = componentNameTodemoPath(name);
      return {
        name: 'default',
        from,
      };
    }
  };
}
