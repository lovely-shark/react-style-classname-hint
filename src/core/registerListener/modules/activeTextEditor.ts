import * as vscode from 'vscode';

import { StoreActiveTextEditor } from '../../store';
import { parseDocImportStyle } from '../../utils';
import Throttle from '../../utils/modules/ThrottleFn';

import type { ExtensionContext } from 'vscode';
// 初始化订阅文件监听器
export default function initActiveTextEditorListener(context: ExtensionContext) {
  const storeActiveTextEditor = StoreActiveTextEditor.getStore;
  // 订阅tabs切换事件
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      storeActiveTextEditor.utils.initTextDocStyle(editor.document);
    }
  });

  // 订阅文档修改事件
  vscode.workspace.onDidChangeTextDocument(
    Throttle(textDocument => {
      const { currentActiveFilePath, styleClassNameMap } = storeActiveTextEditor.get();
      if (currentActiveFilePath === textDocument.document.fileName) {
        const currentFileStyles = parseDocImportStyle(textDocument.document);
        const oldActiveStyleFilePaths = [...styleClassNameMap.keys()];
        const newActiveStyleFilePaths = currentFileStyles.map(item => item.path);
        const needRemoveFilePaths = oldActiveStyleFilePaths.filter(
          path => !newActiveStyleFilePaths.includes(path)
        );
        const needUpdateFileStyles = newActiveStyleFilePaths
          .filter(path => !oldActiveStyleFilePaths.includes(path))
          .map(path => currentFileStyles.find(item => item.path === path)!);

        needRemoveFilePaths.forEach(path => storeActiveTextEditor.removeStyleClassName(path));
        storeActiveTextEditor.utils.handleFileStyles(needUpdateFileStyles);
      }
    })
  );
  return;
}
