import * as stylus from 'stylus';
import { ClassNameContentMap } from '../../../../typings';
import { filterCssSourceMap } from '../utils';

/**
 * @see https://www.stylus-lang.cn/docs/sourcemaps.html
 * @param cssContent css内容
 * @returns {ClassNameContentMap}
 */
export default function parseStylusToCss(cssContent: string): Promise<ClassNameContentMap> {
  return new Promise<ClassNameContentMap>((resolve, reject) => {
    const style = stylus(cssContent).set('sourcemap', {});
    style.render(async (err, css) => {
      if (err) reject(err.message);
      resolve(await filterCssSourceMap((style as any).sourcemap, css));
    });
  });
}
