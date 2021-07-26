import type { ExtensionContext, Uri } from 'vscode';
import * as vscode from 'vscode';
import { styleSuffixStr } from '../../constants/';
import { useStore } from '../../store';
import matchCssFileSuffix from '../../utils/modules/matchCssFileSuffix';

export default function createStyleFileWatcher(context: ExtensionContext): void {
  const styleFileWatcher = vscode.workspace.createFileSystemWatcher(`**/*.{${styleSuffixStr}}`);
  styleFileWatcher.onDidChange(styleFileChange);
  styleFileWatcher.onDidDelete(styleFileDelete);
  styleFileWatcher.onDidCreate(styleFileCreate);
  return;

  function styleFileChange(u: Uri) {
    if (isContainDepPath(u.path)) return;
    const { storeActiveTextEditor } = useStore();
    const { styleFilePaths } = storeActiveTextEditor.get();
    if (styleFilePaths.includes(u.path)) {
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
    console.log('styleFileChange', u);
  }
  function styleFileDelete(u: Uri) {
    if (isContainDepPath(u.path)) return;
  }
  function styleFileCreate(u: Uri) {
    if (isContainDepPath(u.path)) return;
    console.log('styleFileCreate', u);
  }

  function isContainDepPath(path: string): boolean {
    return /\/node_modules\//.test(path);
  }
}
