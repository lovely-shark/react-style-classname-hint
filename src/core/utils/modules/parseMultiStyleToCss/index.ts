import * as fs from 'fs';
import { ClassNameContentMap, StyleTypes } from '../../../typings';
import parseLessToCss from './modules/parseLessToCss';
import parseSassToCss from './modules/parseSassToCss';
import parseStylusToCss from './modules/parseStylusToCss';

export default async function parseMultiStyleToCss(
  stylePath: string,
  styleType: StyleTypes
): Promise<ClassNameContentMap | null> {
  let cssContent = fs.readFileSync(stylePath).toString();

  let cssResult: ClassNameContentMap | null = null;
  switch (styleType) {
    case StyleTypes.LESS:
      cssResult = await parseLessToCss(cssContent);
      break;
    case StyleTypes.SCSS:
    case StyleTypes.SASS:
      cssResult = await parseSassToCss(stylePath);
      break;
    case StyleTypes.STYL:
      cssResult = await parseStylusToCss(cssContent);
      break;
    case StyleTypes.CSS:
      break;
  }
  return cssResult;
}
