import { renderSync } from 'sass';
import * as sourceMap from 'source-map';
import type { ClassNameSourceLines } from '../../../../typings';

type PositionInfo = Record<'line' | 'column', number>;
type ClassNameRelatdLinesType = Array<{ g: PositionInfo; o: PositionInfo }>;

export default async function parseSassToCss(filePath: string): Promise<ClassNameSourceLines> {
  const convertCss = renderSync({ file: filePath, sourceMap: true, outFile: './' });
  const result: ClassNameSourceLines = {};
  if (convertCss.map) {
    const cssMapStr = convertCss.map.toString();
    const cssContent = convertCss.css.toString();

    const consumer = await new sourceMap.SourceMapConsumer(cssMapStr);
    const classNameRelatdLines: ClassNameRelatdLinesType = [];
    consumer.eachMapping(item => {
      if (item.generatedColumn === 0) {
        classNameRelatdLines.push({
          g: {
            line: item.generatedLine,
            column: item.generatedColumn,
          },
          o: {
            line: item.originalLine,
            column: item.originalColumn,
          },
        });
      }
    });

    const cssContentSplit = cssContent.split('\n');
    classNameRelatdLines.forEach(item => {
      const { g, o } = item;
      const relatdLine = cssContentSplit[g.line - 1];
      if (/\.[\w\- ]*\{$/.test(relatdLine)) {
        const className = relatdLine.match(/(?<=\.)[\w\-]*(?= *\{)/)?.[0]!;

        let classStyleContent = cssContentSplit.slice(g.line - 1).join('\n');
        classStyleContent = classStyleContent.match(/(?<=\.[\w- ]*)(\{.+?\})/ms)?.[0]!;

        result[className] = {
          sourcePosition: {
            line: o.line,
            column: o.column,
          },
          styleContent: classStyleContent,
        };
      }
    });
  }

  return result;
}
