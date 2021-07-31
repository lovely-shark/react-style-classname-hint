import type { TextDocument } from 'vscode';
import * as vscode from 'vscode';
import type { ClassNameSourceLines, ParseDocImportStyleResult } from '../../typings';
import { parseCssToClassNames, parseDocImportStyle, parseMultiStyleToCss } from '../../utils';

type FilePath = string;
interface ActiveTextEditor {
  currentActiveFilePath: string;
  styleFilePaths: Set<FilePath>;
  styleClassNameMap: Map<FilePath, ClassNameSourceLines>;
}

const initStoreValues = (): ActiveTextEditor => ({
  currentActiveFilePath: '',
  styleFilePaths: new Set(),
  styleClassNameMap: new Map(),
});

export default class StoreActiveTextEditor {
  private state: ActiveTextEditor;

  static storeActive: StoreActiveTextEditor;

  constructor() {
    this.state = initStoreValues();
  }
  static get getStore() {
    return this.storeActive ?? (this.storeActive = new StoreActiveTextEditor());
  }
  get(): ActiveTextEditor {
    return this.state;
  }

  resetState(): void {
    this.state = initStoreValues();
  }

  setCurrentActiveFilePath(path: string): void {
    this.state.currentActiveFilePath = path;
  }

  // 根据 styleFile 路径，解析 style 文件并存入 styleClassNameMap
  updateActiveStyleContent(filePath: string, classNameSource: ClassNameSourceLines): void {
    // TODO: 这一步似乎可以忽略掉？暂定
    if (!this.state.styleFilePaths.has(filePath)) {
      this.state.styleFilePaths.add(filePath);
    }

    const oldClassNameSourceLines: ClassNameSourceLines =
      this.state.styleClassNameMap.get(filePath) ?? {};

    this.state.styleClassNameMap.set(filePath, { ...oldClassNameSourceLines, ...classNameSource });
  }

  /* removeActiveStyleContent(filePath: string): void {
    const findFilePathIndex = this.state.styleFilePaths.indexOf(filePath);
    if (findFilePathIndex !== -1) {
      this.state.styleFilePaths.splice(findFilePathIndex, -1);
      delete this.state.styleClassNameMap[filePath];
    }
  } */
  private clearStyleFilePaths() {
    this.state.styleClassNameMap.clear();
  }

  private fillStyleFilePaths(stylePathList: FilePath[]) {
    this.state.styleFilePaths = new Set(stylePathList);
  }

  get utils() {
    return {
      initTextDocStyle: this.utilInitTextDocStyle,
      handleFileStyles: this.utilHandleFileStyles,
      clearStyleFilePaths: this.clearStyleFilePaths,
      fillStyleFilePaths: this.fillStyleFilePaths,
    };
  }

  // 解析当前编辑文件中引入的样式，初始化 store。 // TODO: 后面扩充 store 做文件缓存，已经解析过的不再重复解析
  private utilInitTextDocStyle = (document: TextDocument): void => {
    const { path } = document.uri;
    // TODO: 暂时只支持 tsx、js、ts，后续作为配置文件单独抽离，可自定义需要解析的文件，提升性能。
    if (/(tsx|js|ts)$/.test(path)) {
      this.resetState();
      this.setCurrentActiveFilePath(path);
      const currentFileStyles = parseDocImportStyle(document);
      this.utilHandleFileStyles(currentFileStyles);
    }
  };

  // 解析样式文件并保存
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
