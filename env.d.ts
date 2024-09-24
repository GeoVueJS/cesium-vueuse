/// <reference types="vite/client" />
import type { AttributifyAttributes } from '@unocss/preset-attributify';

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes {}
}

declare global {
  export type GlobalComponents = import('vue').GlobalComponents;
}
