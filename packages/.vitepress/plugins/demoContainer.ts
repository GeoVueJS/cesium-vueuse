import fs from 'node:fs';
import path from 'node:path';
import mdContainer from 'markdown-it-container';
import type MarkdownIt from 'markdown-it';
import type { MarkdownEnv } from 'vitepress';
import { demoPathToComponentName } from '../utils/normalizeDemo';

// eslint-disable-next-line regexp/no-super-linear-backtracking
const demoRE = /^demo\s*(.*)$/;

export function markdownDemoContainer(md: MarkdownIt) {
  mdContainer(md, 'demo', {
    validate(params) {
      return !!params.trim().match(demoRE);
    },
    render(tokens: any, idx: any, options: any, env: MarkdownEnv) {
      const opening = tokens[idx].nesting === 1;
      const m = tokens[idx].info.trim().match(demoRE);
      if (opening) {
        const demoPath = m?.[1] ?? '';
        const demoRealPath = path.resolve(env.realPath!, '../', demoPath);
        const code = fs.readFileSync(demoRealPath, 'utf-8').toString();
        const codeHtml = md.render(`\`\`\`${path.extname(demoRealPath).slice(1)}\n${code}\n\`\`\``);
        const demoComponentName = demoPathToComponentName(demoRealPath);
        return `
<demo-container
code-html="${encodeURIComponent(codeHtml)}"
code="${encodeURIComponent(code)}"
>
<template #demo>
<${demoComponentName}/>
</template>
`;
      }
      else {
        return '</demo-container>';
      }
    },
  });
}
