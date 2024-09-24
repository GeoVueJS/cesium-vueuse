import type MarkdownIt from 'markdown-it';
import type { MarkdownEnv } from 'vitepress';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import mdContainer from 'markdown-it-container';

// eslint-disable-next-line regexp/no-super-linear-backtracking
const demoRE = /^demo\s*(.*)$/;

export function markdownDemoContainer(md: MarkdownIt) {
  mdContainer(md, 'demo', {
    validate(params) {
      return !!params.trim().match(demoRE);
    },
    render(tokens: any, idx: any, options: any, env: MarkdownEnv) {
      const opening = tokens[idx].nesting === 1;

      if (opening) {
        const props: string = tokens[idx].info.trim().match(demoRE)?.[1];

        const src = props.trim().match(/src=['"](.*?)['"]/)?.[1];
        if (!src) {
          throw new Error(`demo src is not found in ${env.realPath}`);
        }
        const demoRealPath = path.resolve(env.realPath!, '../', src);
        const demoRelativePath = path.relative(process.cwd(), demoRealPath);
        const code = fs.readFileSync(demoRealPath, 'utf-8').toString();
        const codeHtml = md.render(`\`\`\`${path.extname(demoRealPath).slice(1)}\n${code}\n\`\`\``);

        return `
<demo-container
${props}
:aysnc-demo="()=>import('${src}')"
path="${demoRelativePath}"
code="${encodeURIComponent(code)}"
code-html="${encodeURIComponent(codeHtml)}"
>
`;
      }
      else {
        return '</demo-container>\n';
      }
    },
  });
}
