type FilePath = string;
interface ActiveTextEditor {
  currentActiveFilePath: string;
  styleFilePaths: FilePath[];
  styleClassNameMap: Record<FilePath, string[]>;
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

  updateActiveStyleContent(filePath: string, classNames: string[]): void {
    if (!this.state.styleFilePaths.includes(filePath)) {
      this.state.styleFilePaths.push(filePath);
    }
    this.state.styleClassNameMap[filePath] = classNames;
  }

  removeActiveStyleContent(filePath: string): void {
    const findFilePathIndex = this.state.styleFilePaths.indexOf(filePath);
    if (findFilePathIndex !== -1) {
      this.state.styleFilePaths.splice(findFilePathIndex, -1);
      delete this.state.styleClassNameMap[filePath];
    }
  }
}
