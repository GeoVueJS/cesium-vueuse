import * as fs from 'node:fs';

/**
 * 获取指定根目录下的 package.json 文件内容
 *
 * @returns 返回一个包含 package.json 文件内容的对象
 */
export function getPkgJSON(filePath: string): Record<string, any> {
  const str = fs.readFileSync(filePath).toString();
  return JSON.parse(str);
}
