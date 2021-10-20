import * as less from 'less';
import type { ClassNameContentMap } from '../../../../typings';
import { filterCssSourceMap } from '../utils';

export default function parseLessToCss(cssContent: string): Promise<ClassNameContentMap> {
  return new Promise<ClassNameContentMap>((resolve, reject) => {
    less
      .render(cssContent, {
        sourceMap: { outputSourceFiles: true },
      })
      .then(async res => {
        resolve(await filterCssSourceMap(res.map, res.css));
      })
      .catch(reject);
  });
}
