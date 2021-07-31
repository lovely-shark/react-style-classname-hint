import type { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { StoreActiveTextEditor } from '../../store';
import { parseDocImportStyle, ThrottleFn } from '../../utils';
import Throttle from '../../utils/modules/throttleFn';

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
      const { currentActiveFilePath, styleFilePaths } = storeActiveTextEditor.get();

      if (currentActiveFilePath === textDocument.document.fileName) {
        const oldActiveStyleFilePaths = styleFilePaths;
        // 清空旧的 styleFilePaths，不需要删除 styleClassNameMap，可以作为缓存
        storeActiveTextEditor.utils.clearStyleFilePaths();

        // 处理新增 styleFilePaths 、 styleClassNameMap
        const currentFileStyles = parseDocImportStyle(textDocument.document);

        storeActiveTextEditor.utils.fillStyleFilePaths(currentFileStyles.map(item => item.path));

        const needAddNewFileStyles = currentFileStyles.filter(
          ({ path }) => !oldActiveStyleFilePaths.has(path)
        );
        storeActiveTextEditor.utils.handleFileStyles(needAddNewFileStyles);
      }
    })
  );
  return;
}
