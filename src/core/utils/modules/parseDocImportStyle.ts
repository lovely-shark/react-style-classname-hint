import * as path from 'path';
import type { TextDocument } from 'vscode';
import type { ParseDocImportStyleResult } from '../../typings';
import matchCssFileSuffix from './matchCssFileSuffix';

/**
 * 解析文档中引入的样式路径
 * @param document 需要解析的文档内容
 * @returns 当前页包含的css文件路径与文件类型(css/less...)
 */
export default function parseDocImportStyle(document: TextDocument): ParseDocImportStyleResult {
  const fileContent = document.getText();
  const currentFolderPath = path.dirname(document.fileName);

  const parseResult: ParseDocImportStyleResult = (() => {
    const result: ParseDocImportStyleResult = [];
    const importClassList = fileContent.match(
      /^(import +)('|")(.+?\.(((le|sc|c|sa)ss)|styl))('|");?$/gm
    );

    if (importClassList) {
      importClassList.forEach(importVal => {
        const [styleFileRelativePath] = importVal.match(/(?<=('|"))(.+?)(?=('|");?$)/) ?? [];
        if (styleFileRelativePath) {
          const fileSuffix = matchCssFileSuffix(styleFileRelativePath);
          if (fileSuffix) {
            const styleFileAbsPath = path.resolve(currentFolderPath, styleFileRelativePath);
            result.push({
              path: styleFileAbsPath,
              type: fileSuffix,
            });
          }
        }
      });
    }
    return result;
  })();

  return parseResult;
}
