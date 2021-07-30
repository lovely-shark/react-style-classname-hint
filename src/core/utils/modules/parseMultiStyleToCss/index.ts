import { ClassNameSourceLines, StyleTypes } from '../../../typings';
// import parseLessToCss from './modules/parseLessToCss';
import parseSassToCss from './modules/parseSassToCss';
// import parseStylusToCss from './modules/parseStylusToCss';
import * as fs from 'fs';

export default async function parseMultiStyleToCss(
  stylePath: string,
  styleType: StyleTypes
): Promise<ClassNameSourceLines | null> {
  let cssContent = fs.readFileSync(stylePath).toString();
  let cssResult: ClassNameSourceLines | null = null;
  switch (styleType) {
    // case StyleTypes.LESS:
    //   cssContent = (await parseLessToCss(cssContent)).css;
    // break;
    case StyleTypes.SCSS:
    case StyleTypes.SASS:
      cssResult = await parseSassToCss(stylePath);
      break;
    // case StyleTypes.STYL:
    //   cssContent = await parseStylusToCss(cssContent);
    //   break;
    case StyleTypes.CSS:
      break;
  }
  return cssResult;
}
