import { renderSync } from 'sass';
import type { ClassNameContentMap } from '../../../../typings';
import { filterCssSourceMap } from '../utils';

/**
 *
 * @param filePath 样式文件路径
 * @returns {ClassNameContentMap}
 */
export default async function parseSassToCss(filePath: string): Promise<ClassNameContentMap> {
  const convertCss = renderSync({ file: filePath, sourceMap: true });

  let result: ClassNameContentMap = {};
  if (convertCss.map) {
    const cssMapStr = convertCss.map.toString();
    const cssContent = convertCss.css.toString();
    result = await filterCssSourceMap(cssMapStr, cssContent);
  }
  return result;
}
