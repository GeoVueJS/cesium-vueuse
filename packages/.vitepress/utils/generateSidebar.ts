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
  sort: number;
}

export function generateSidebar(options: GenerateSidebarOptions): DefaultTheme.SidebarItem[] {
  let base = options.base || '/';
  if (!base.endsWith('/')) {
    base += '/';
  }

  // 使用 FastGlob 同步查找所有 Markdown 文件
  const data = FastGlob.sync(['**/*.md', '*.md'], {
    cwd: VITEPRESS_PACKAGE_PATH,
    ignore: ['**/node_modules/**', '**/dist/**', '.vitepress'],
  });

  // 创建过滤器以包含或排除特定文件
  const globFilter = createFilter(options.include, options.exclude);
  const filter = (path: string) => {
    return globFilter(path) && (options.filter?.(path) ?? true);
  };

  // 过滤并规范化文件路径
  const filePaths = data.filter(filter).map(filePath => normalizePath(filePath));

  let flatList: TreeItem[] = [];

  // 遍历每个文件路径以生成侧边栏项
  filePaths.forEach((filePath) => {
    const file = path.resolve(VITEPRESS_PACKAGE_PATH, filePath);
    const m = matter(readFileSync(file).toString());
    if (m.data.layout) {
      return;
    }

    // 生成链接、文本和其他属性
    const link = filePath
      .replace(/\.md$/, '')
      .replace(/(\.(\w|-)*)$/, '')
      .replace(/(\/?index)+$/, '');
    let text = m.data.text || link.split('/').pop();
    m.data?.tip && (text += `<Badge type="tip" text="${m.data.tip}" />`);
    const item: TreeItem = {
      file,
      text,
      link,
      parent: link.includes('/') ? link.replace(/\/.+$/, '') : undefined,
      isRoot: !link.includes('/'),
      sort: (m.data?.sort ?? Number.MAX_SAFE_INTEGER),
    };
    const exist = flatList.find(f => f.link === link);
    if (exist) {
      Object.assign(exist, item);
    }
    else {
      flatList.push(item);
    }

    // 处理父节点
    const parentNodes = link.split('/');
    parentNodes.pop();
    while (parentNodes.length) {
      const link = parentNodes.join('/');
      const item: TreeItem = {
        text: link.split('/').pop(),
        parent: link.includes('/') ? link.replace(/\/.+$/, '') : undefined,
        isRoot: !link.includes('/'),
        sort: Number.MAX_SAFE_INTEGER,
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

  // 按排序字段对 flatList 进行排序
  flatList = flatList.sort((a, b) => a.sort - b.sort);

  // 生成侧边栏
  const sidebars: (DefaultTheme.SidebarItem & { isRoot?: boolean;sort: number })[] = flatList.map((item) => {
    const items = flatList.filter(e => e.parent === item.link);
    return {
      base: item.isRoot ? base : undefined,
      text: item.text || 'index',
      link: item.file ? item.link : undefined,
      items: items.length ? items : undefined,
      isRoot: item.isRoot,
      sort: item.sort,
    };
  });
  return sidebars.filter(item => item.isRoot);
}
