import type { FilterPattern } from 'vite';
import type { DefaultTheme } from 'vitepress';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import FastGlob from 'fast-glob';
import matter from 'gray-matter';
import { createFilter, normalizePath } from 'vite';
import { VITEPRESS_PACKAGE_PATH } from '../path';

export interface GenerateSidebarOptions {
  base: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
  filter?: (path: string) => boolean;
}

interface TreeItem {
  isRoot?: boolean;
  file?: string;
  text?: string;
  link: string;
  parent?: string;
}

export function generateSidebar(options: GenerateSidebarOptions): DefaultTheme.SidebarItem[] {
  let base = options.base || '/';
  if (!base.endsWith('/')) {
    base += '/';
  }

  const data = FastGlob.sync(['**/*.md', '*.md'], {
    cwd: VITEPRESS_PACKAGE_PATH,
    ignore: ['**/node_modules/**', '**/dist/**', '.vitepress'],
  });

  const globFilter = createFilter(options.include, options.exclude);
  const filter = (path: string) => {
    return globFilter(path) && (options.filter?.(path) ?? true);
  };

  const filePaths = data.filter(filter).map(filePath => normalizePath(filePath));

  const flatList: TreeItem[] = [];

  filePaths.forEach(async (filePath) => {
    const link = filePath
      .replace(/\.md$/, '')
      .replace(/(\.(\w|-)*)$/, '')
      .replace(/(\/?index)+$/, '');
    const file = path.resolve(VITEPRESS_PACKAGE_PATH, filePath);
    const m = matter(readFileSync(file).toString());
    let text = link.split('/').pop();
    m.data?.tip && (text += `<Badge type="tip" text="${m.data.tip}" />`);
    const item: TreeItem = {
      file,
      text,
      link,
      parent: link.includes('/') ? link.replace(/\/.+$/, '') : undefined,
      isRoot: !link.includes('/'),
    };
    const exist = flatList.find(f => f.link === link);
    if (exist) {
      Object.assign(exist, item);
    }
    else {
      flatList.push(item);
    }

    const parentNodes = link.split('/');
    parentNodes.pop();
    while (parentNodes.length) {
      const link = parentNodes.join('/');
      const item: TreeItem = {
        text: link.split('/').pop(),
        parent: link.includes('/') ? link.replace(/\/.+$/, '') : undefined,
        isRoot: !link.includes('/'),
        link,
      };
      const exist = flatList.find(item => item.link === link);
      if (exist) {
        Object.assign(exist, item);
      }
      else {
        flatList.push(item);
      }
      parentNodes.pop();
    }
  });

  const sidebars: (DefaultTheme.SidebarItem & { isRoot?: boolean })[] = flatList.map((item) => {
    const items = flatList.filter(e => e.parent === item.link);

    return {
      base: item.isRoot ? base : undefined,
      text: item.text || 'index',
      link: item.file ? item.link : undefined,
      items: items.length ? items : undefined,
      isRoot: item.isRoot,
    };
  });

  return sidebars.filter(item => item.isRoot);
}
