import { StyleTypes } from '../../../typings';
import readCssFileContent from '../readCssFileContent';
import parseLessToCss from './modules/parseLessToCss';
import parseSassToCss from './modules/parseSassToCss';
import parseStylusToCss from './modules/parseStylusToCss';

export default async function parseMultiStyleToCss(
  stylePath: string,
  styleType: StyleTypes
): Promise<string> {
  let cssContent = readCssFileContent(stylePath);
  switch (styleType) {
    case StyleTypes.LESS:
      cssContent = (await parseLessToCss(cssContent)).css;
      break;
    case StyleTypes.SCSS:
    case StyleTypes.SASS:
      cssContent = await parseSassToCss(stylePath);
      break;
    case StyleTypes.STYL:
      cssContent = await parseStylusToCss(cssContent);
      break;
    case StyleTypes.CSS:
      break;
  }
  return cssContent;
}
