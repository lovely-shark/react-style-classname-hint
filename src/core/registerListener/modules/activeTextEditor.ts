import type { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { useStore } from '../../store';
import { parseDocImportStyle, ThrottleFn } from '../../utils';

export default function initActiveTextEditorListener(context: ExtensionContext) {
  const { storeActiveTextEditor } = useStore();
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      storeActiveTextEditor.utils.initTextDocStyle(editor.document);
    }
  });

  void (function onDidChangeTextDocument() {
    const changeThrottle = new ThrottleFn();
    vscode.workspace.onDidChangeTextDocument(textDocument => {
      changeThrottle.exec(2000, () => {
        const { currentActiveFilePath, styleFilePaths } = storeActiveTextEditor.get();
        if (currentActiveFilePath === textDocument.document.fileName) {
          const currentFileStyles = parseDocImportStyle(textDocument.document);
          const oldActiveStyleFilePaths = styleFilePaths;
          const newActiveStyleFilePaths = currentFileStyles.map(item => item.path);

          const needRemoveFilePaths = oldActiveStyleFilePaths.filter(
            path => !newActiveStyleFilePaths.includes(path)
          );
          const needUpdateFileStyles = newActiveStyleFilePaths
            .filter(path => !oldActiveStyleFilePaths.includes(path))
            .map(path => currentFileStyles.find(item => item.path === path)!);

          needRemoveFilePaths.forEach(path => storeActiveTextEditor.removeActiveStyleContent(path));
          storeActiveTextEditor.utils.handleFileStyles(needUpdateFileStyles);
        }
      });
    });
  })();

  return;
}
