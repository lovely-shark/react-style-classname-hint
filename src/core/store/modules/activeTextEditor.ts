import type { TextDocument } from 'vscode';
import * as vscode from 'vscode';
import type { ClassNameSourceLines, ParseDocImportStyleResult } from '../../typings';
import { parseCssToClassNames, parseDocImportStyle, parseMultiStyleToCss } from '../../utils';

type FilePath = string;
interface ActiveTextEditor {
  currentActiveFilePath: string;
  styleFilePaths: FilePath[];
  // styleClassNameMap: Record<FilePath, string[]>;
  styleClassNameMap: Record<FilePath, ClassNameSourceLines>;
}

const initStoreValues = (): ActiveTextEditor => ({
  currentActiveFilePath: '',
  styleFilePaths: [],
  styleClassNameMap: {},
});

export default class StoreActiveTextEditor {
  private state: ActiveTextEditor = initStoreValues();
  constructor() {}

  get(): ActiveTextEditor {
    return this.state;
  }

  resetState(): void {
    this.state = initStoreValues();
  }

  setCurrentActiveFilePath(path: string): void {
    this.state.currentActiveFilePath = path;
  }

  updateActiveStyleContent(filePath: string, classNameSource: ClassNameSourceLines): void {
    if (!this.state.styleFilePaths.includes(filePath)) {
      this.state.styleFilePaths.push(filePath);
    }

    this.state.styleClassNameMap[filePath] = Object.assign(
      this.state.styleClassNameMap[filePath] ?? {},
      classNameSource
    );
  }

  removeActiveStyleContent(filePath: string): void {
    const findFilePathIndex = this.state.styleFilePaths.indexOf(filePath);
    if (findFilePathIndex !== -1) {
      this.state.styleFilePaths.splice(findFilePathIndex, -1);
      delete this.state.styleClassNameMap[filePath];
    }
  }

  get utils() {
    return {
      initTextDocStyle: this.utilInitTextDocStyle,
      handleFileStyles: this.utilHandleFileStyles,
    };
  }

  private utilInitTextDocStyle = (document: TextDocument): void => {
    const { path } = document.uri;
    if (/(tsx|js|ts)$/.test(path)) {
      this.resetState();
      this.setCurrentActiveFilePath(path);
      const currentFileStyles = parseDocImportStyle(document);
      this.utilHandleFileStyles(currentFileStyles);
    }
  };

  private utilHandleFileStyles = async (fileStyles: ParseDocImportStyleResult): Promise<void> => {
    fileStyles.forEach(async style => {
      try {
        const classNameSources = await parseMultiStyleToCss(style.path, style.type);
        if (classNameSources) {
          this.updateActiveStyleContent(
            style.path,
            classNameSources // Array.from(new Set(parseCssToClassNames(cssContent)))
          );
        }
      } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage(`处理${style.path}样式异常`);
      }
    });
  };
}
