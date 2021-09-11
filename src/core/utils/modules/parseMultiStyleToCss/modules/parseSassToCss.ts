import { renderSync } from 'sass';
import type { ClassNameContentMap } from '../../../../typings';
import { filterCssSourceMap } from '../utils';

/**
 *
 * @param filePath 样式文件路径
 * @returns {ClassNameContentMap}
 */
export default async function parseSassToCss(filePath: string): Promise<ClassNameContentMap> {
  const convertCss = renderSync({ file: filePath, sourceMap: true, outFile: filePath + 'adj' });
  console.log('解析结果：', convertCss, {
    file: filePath,
    sourceMap: true,
    outFile: filePath + 'adj',
  });

  let result: ClassNameContentMap = {};
  if (convertCss.map) {
    const cssMapStr = convertCss.map.toString();
    const cssContent = convertCss.css.toString();
    console.log('cssMapStr->', cssMapStr);
    console.log('cssContent->', cssContent);

    result = await filterCssSourceMap(cssMapStr, cssContent);
  }
  return result;
}
