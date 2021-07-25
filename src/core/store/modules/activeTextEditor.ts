import type { ExtensionContext, Uri } from 'vscode';

type FilePath = string;
export interface ActiveTextEditor {
  currentActiveFilePath: string;
  styleFilePaths: FilePath[];
  styleClassNameMap: Record<FilePath, string[]>;
}

export default class {
  private readonly STORE_KEY = 'ACTIVE_STYLE_FILE';
  constructor(private readonly vscodeContext: ExtensionContext) {}

  get(): ActiveTextEditor {
    return (
      this.vscodeContext.workspaceState.get<ActiveTextEditor>(this.STORE_KEY) ?? {
        currentActiveFilePath: '',
        styleFilePaths: [],
        styleClassNameMap: {},
      }
    );
  }

  set(activeTextEditor: ActiveTextEditor): void {
    this.vscodeContext.workspaceState.update(this.STORE_KEY, activeTextEditor);
  }

  setCurrentActiveFilePath(path: string) {
    const activeTextEditor = this.get();
    activeTextEditor.currentActiveFilePath = path;
    this.set(activeTextEditor);
  }

  updateActiveStyleFile(filePath: string, classNames: string[]): void {
    const activeTextEditor = this.get();
    if (!activeTextEditor.styleFilePaths.includes(filePath)) {
      activeTextEditor.styleFilePaths.push(filePath);
    }
    activeTextEditor.styleClassNameMap[filePath] = classNames;
    this.set(activeTextEditor);
  }

  removeActiveStyleFile(filePath: string): void {
    const activeTextEditor = this.get();
    const findfilePathIndex = activeTextEditor.styleFilePaths.indexOf(filePath);
    if (findfilePathIndex !== -1) {
      activeTextEditor.styleFilePaths.splice(findfilePathIndex, -1);
      delete activeTextEditor.styleClassNameMap[filePath];
    }
    this.set(activeTextEditor);
  }
}
