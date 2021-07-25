import type { ExtensionContext, Uri } from 'vscode'

export interface StyleFileType extends Uri {}

export default class AllStyleFile {
  constructor(private readonly vscodeContext: ExtensionContext) {}
  private readonly STORE_KEY = 'ALL_STYLE_FILE_KEY'

  get(): StyleFileType[] {
    return this.vscodeContext.workspaceState.get<StyleFileType[]>(this.STORE_KEY) ?? []
  }

  set(fileUris: StyleFileType[]): void {
    this.vscodeContext.workspaceState.update(this.STORE_KEY, fileUris)
  }

  push(fileUri: StyleFileType): void {
    const styleFiles = this.get()
    styleFiles.push(fileUri)
    this.set(styleFiles)
  }

  delete(fileUri: StyleFileType): void {
    const styleFiles = this.get()

    const fileIndex = styleFiles.indexOf(fileUri)
    styleFiles.splice(fileIndex, 1)

    this.set(styleFiles)
  }
}
