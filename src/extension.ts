import type { ExtensionContext } from 'vscode';
import registerCompletion from './core/registerCompletion';
import registerListener from './core/registerListener/index';
import * as vscode from 'vscode';
import { StoreActiveTextEditor } from './core/store';

export function activate(context: ExtensionContext) {
  registerListener(context);
  registerCompletion(context);
  // TODO: 初始化需要单独拆成一个函数
  void (function initCurrentOpenEditor() {
    const storeActiveTextEditor = StoreActiveTextEditor.getStore;
    const [firstTextDocument] = vscode.workspace.textDocuments;
    if (/tsx$/.test(firstTextDocument?.fileName)) {
      storeActiveTextEditor.utils.initTextDocStyle(firstTextDocument);
    }
  })();
}
