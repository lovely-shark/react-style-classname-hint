import type { ExtensionContext } from 'vscode'
import AllStyleFile from './modules/allStyleFile'
import ActiveTextEditor from './modules/activeTextEditor'

interface RootStoreType {
  storeAllStyleFile: AllStyleFile
  storeActiveTextEditor: ActiveTextEditor
}

let rootStore: RootStoreType | null = null
export const useStore = (context?: ExtensionContext) =>
  rootStore ??
  (rootStore = {
    storeAllStyleFile: new AllStyleFile(context!),
    storeActiveTextEditor: new ActiveTextEditor(context!),
  })

export type { default as ActiveStyleFile } from './modules/activeTextEditor'
export type { default as AllStyleFile, StyleFileType } from './modules/allStyleFile'
