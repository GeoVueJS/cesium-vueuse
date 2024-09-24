import type MarkdownIt from 'markdown-it';
import type { MarkdownEnv } from 'vitepress';
import fs from 'node:fs';
import path from 'node:path';
import mdContainer from 'markdown-it-container';

// eslint-disable-next-line regexp/no-super-linear-backtracking
const dtsRE = /^dts\s*(.*)$/;

export function markdownDtsContainer(md: MarkdownIt) {
  mdContainer(md, 'dts', {
    validate(params) {
      return !!params.trim().match(dtsRE);
    },
    render(tokens: any, idx: any, options: any, env: MarkdownEnv) {
      const opening = tokens[idx].nesting === 1;

      if (opening) {
        const srcs: string = tokens[idx].info.trim().match(dtsRE)?.[1];
        const paths = [...new Set(srcs.split(' ').filter(src => !!src))];
        const data = paths.map((src) => {
          const realPath = path.resolve(env.realPath!, '../', src);
          const code = fs.readFileSync(realPath, 'utf-8').toString();
          return md.render(`\`\`\`typescript\n${code}\n\`\`\``);
        });

        return data.join('\n');
      }
      else {
        return '';
      }
    },
  });
}
