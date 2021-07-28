import { StyleTypes } from '../../../typings';
import readCssFileContent from '../readCssFileContent';
import parseLessToCss from './modules/parseLessToCss';
import parseStylusToCss from './modules/parseStylusToCss';

export default async function parseMultiStyleToCss(
  stylePath: string,
  styleType: StyleTypes
): Promise<string> {
  let cssContent = readCssFileContent(stylePath);
  switch (styleType) {
    case StyleTypes.LESS:
    case StyleTypes.SCSS:
      cssContent = (await parseLessToCss(cssContent)).css;
      break;
    case StyleTypes.SASS:
    case StyleTypes.STYL:
      cssContent = await parseStylusToCss(cssContent);
      break;
    case StyleTypes.CSS:
      break;
  }
  return cssContent;
}
