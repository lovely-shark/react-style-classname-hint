import * as sourceMap from 'source-map';
import { ClassNameContentMap } from '../../../typings';
import { ClassNameRelatdLinesType } from './typings';

export const filterCssSourceMap = async (
  cssMap: string | any,
  cssContent: string
): Promise<ClassNameContentMap> => {
  const result: ClassNameContentMap = {};
  try {
    const consumer = await new sourceMap.SourceMapConsumer(cssMap);
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
          originPosition: {
            line: o.line,
            column: o.column,
          },
          styleContent: classStyleContent,
        };
      }
    });
  } catch (error) {
    console.error(error);
  }

  return result;
};
