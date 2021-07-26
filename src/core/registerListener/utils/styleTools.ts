import { Uri } from 'vscode';
import { parseLessToCss, parseStylusToCss, readCssFileContent } from '../../utils';

export async function resolveStyleContent(
  stylePath: Uri['path'],
  styleType: string
): Promise<string> {
  let cssContent = readCssFileContent(stylePath);
  switch (styleType) {
    case 'less':
    case 'scss':
      cssContent = (await parseLessToCss(cssContent)).css;
      break;
    case 'sass':
    case 'stylu':
      cssContent = await parseStylusToCss(cssContent);
      break;
    case 'css':
      break;
  }
  return cssContent;
}
