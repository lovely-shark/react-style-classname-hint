import * as vscode from 'vscode';

import { styleSuffixStr } from '../../constants/';
import { StoreActiveTextEditor } from '../../store';
import { matchCssFileSuffix } from '../../utils/';

import type { ExtensionContext, Uri } from 'vscode';
export default function initStyleFileListener(context: ExtensionContext): void {
  const styleFileWatcher = vscode.workspace.createFileSystemWatcher(`**/*.{${styleSuffixStr}}`);
  styleFileWatcher.onDidChange(styleFileChange);
  styleFileWatcher.onDidDelete(styleFileDelete);
  styleFileWatcher.onDidCreate(styleFileCreate);
  return;

  function styleFileChange(u: Uri) {
    if (isContainDepPath(u.path)) return;
    const storeActiveTextEditor = StoreActiveTextEditor.getStore;
    const { styleClassNameMap } = storeActiveTextEditor.get();
    if (styleClassNameMap.has(u.path)) {
      const fileSuffix = matchCssFileSuffix(u.path);
      if (fileSuffix) {
        storeActiveTextEditor.utils.handleFileStyles([
          {
            type: fileSuffix,
            path: u.path,
          },
        ]);
      }
    }
  }
  function styleFileDelete(u: Uri) {
    if (isContainDepPath(u.path)) return;
  }
  function styleFileCreate(u: Uri) {
    if (isContainDepPath(u.path)) return;
  }

  function isContainDepPath(path: string): boolean {
    return /\/node_modules\//.test(path);
  }
}
