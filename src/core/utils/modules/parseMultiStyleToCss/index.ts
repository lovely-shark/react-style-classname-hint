import type { StyleTypes } from '../../../typings';
import readCssFileContent from '../readCssFileContent';
import parseLessToCss from './modules/parseLessToCss';
import parseStylusToCss from './modules/parseStylusToCss';

export default async function parseMultiStyleToCss(
  stylePath: string,
  styleType: StyleTypes
): Promise<string> {
  let cssContent = readCssFileContent(stylePath);
  switch (styleType) {
    case 'less':
    case 'scss':
      cssContent = (await parseLessToCss(cssContent)).css;
      break;
    case 'sass':
    case 'styl':
      cssContent = await parseStylusToCss(cssContent);
      break;
    case 'css':
      break;
  }
  return cssContent;
}
