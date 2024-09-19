import { fileURLToPath } from 'node:url';
import { normalizePath } from 'vite';

/**
 * vitepress root path
 * `{VITEPRESS_ROOT}/.vitepress`
 */
export const VITEPRESS_ROOT = normalizePath(fileURLToPath(new URL('../', import.meta.url))).slice(0, -1);
