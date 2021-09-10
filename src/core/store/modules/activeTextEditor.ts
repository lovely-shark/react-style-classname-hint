import type { TextDocument } from 'vscode';
import * as vscode from 'vscode';
import type { ClassNameContentMap, ParseDocImportStyleResult } from '../../typings';
import { parseDocImportStyle, parseMultiStyleToCss } from '../../utils';

type StylePath = string;
interface ActiveTextEditor {
  currentActiveFilePath: string;
  styleClassNameMap: Map<StylePath, ClassNameContentMap>;
}

const initStoreValues = (): ActiveTextEditor => ({
  currentActiveFilePath: '',
  // TODO: 缓存系列待优化
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
  get(): Readonly<ActiveTextEditor> {
    return this.state;
  }

  resetState(): void {
    this.state = initStoreValues();
  }

  setCurrentActiveFilePath(path: string): void {
    this.state.currentActiveFilePath = path;
  }

  clearStyleClassNameMap(): void {
    this.state.styleClassNameMap.clear();
  }

  removeStyleClassName(stylePath: string): void {
    this.state.styleClassNameMap.delete(stylePath);
  }

  // 根据 styleFile 路径，解析 style 文件并存入 styleClassNameMap
  updateActiveStyleContent(filePath: string, classNameSource: ClassNameContentMap): void {
    const oldClassNameContentMap: ClassNameContentMap =
      this.state.styleClassNameMap.get(filePath) ?? {};
    this.state.styleClassNameMap.set(filePath, { ...oldClassNameContentMap, ...classNameSource });

    console.log('更新map-》', this.state, oldClassNameContentMap, classNameSource);
  }

  get utils() {
    return {
      initTextDocStyle: this.utilInitTextDocStyle,
      handleFileStyles: this.utilHandleFileStyles,
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
    console.log('解析样式', fileStyles);

    fileStyles.forEach(async style => {
      try {
        const classNameSources = await parseMultiStyleToCss(style.path, style.type);
        console.log('解析的样式sourcemap：', classNameSources);

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
