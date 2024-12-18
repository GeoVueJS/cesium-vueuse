import { fileURLToPath } from 'node:url';

export const VITEPRESS_ROOT_PATH = fileURLToPath(new URL('./', import.meta.url));

export const VITEPRESS_PACKAGE_PATH = fileURLToPath(new URL('../', import.meta.url));

export const VITEPRESS_BUILD_TYPES_PATH = fileURLToPath(new URL('./.types', import.meta.url));
