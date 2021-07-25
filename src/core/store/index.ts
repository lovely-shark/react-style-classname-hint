import type { ExtensionContext } from 'vscode';
import ActiveTextEditor from './modules/activeTextEditor';

interface RootStoreType {
  storeActiveTextEditor: ActiveTextEditor;
}

let rootStore: RootStoreType | null = null;
export const useStore = (context?: ExtensionContext) =>
  rootStore ??
  (rootStore = {
    storeActiveTextEditor: new ActiveTextEditor(context!),
  });

export type { default as ActiveStyleFile } from './modules/activeTextEditor';
