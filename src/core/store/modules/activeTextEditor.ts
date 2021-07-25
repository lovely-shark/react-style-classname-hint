import type { ExtensionContext, Uri } from 'vscode';

type FilePath = string;
export interface ActiveTextEditor {
  currentActiveFilePath: string;
  styleFilePaths: FilePath[];
  styleClassNameMap: Record<FilePath, string[]>;
}

export default class {
  private readonly STORE_KEY = 'ACTIVE_STYLE_FILE';
  private state: ActiveTextEditor = {
    currentActiveFilePath: '',
    styleFilePaths: [],
    styleClassNameMap: {},
  };
  constructor(private readonly vscodeContext: ExtensionContext) {
    this.initState();
  }

  get(): ActiveTextEditor {
    return this.state;
  }

  initState(): void {
    this.state = {
      currentActiveFilePath: '',
      styleFilePaths: [],
      styleClassNameMap: {},
    };
  }

  setCurrentActiveFilePath(path: string): void {
    this.state.currentActiveFilePath = path;
  }

  updateActiveStyleFile(filePath: string, classNames: string[]): void {
    if (!this.state.styleFilePaths.includes(filePath)) {
      this.state.styleFilePaths.push(filePath);
    }
    this.state.styleClassNameMap[filePath] = classNames;
  }

  removeActiveStyleFile(filePath: string): void {
    const activeTextEditor = this.get();
    const findfilePathIndex = activeTextEditor.styleFilePaths.indexOf(filePath);
    if (findfilePathIndex !== -1) {
      activeTextEditor.styleFilePaths.splice(findfilePathIndex, -1);
      delete activeTextEditor.styleClassNameMap[filePath];
    }
  }
}
