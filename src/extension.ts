import * as vscode from 'vscode';

import registerCompletion from './core/registerCompletion';
import registerDefinition from './core/registerDefinition';
import registerListener from './core/registerListener';
import { StoreActiveTextEditor } from './core/store';

import type { ExtensionContext } from 'vscode';
export function activate(context: ExtensionContext) {
  registerListener(context);
  registerCompletion(context);
  registerDefinition(context);
  console.log('shark-启动成功');
  
  // // TODO: 初始化需要单独拆成一个函数
  void (function initCurrentOpenEditor() {
    const storeActiveTextEditor = StoreActiveTextEditor.getStore;
    const [firstTextDocument] = vscode.workspace.textDocuments;
    if (/tsx$/.test(firstTextDocument?.fileName)) {
      storeActiveTextEditor.utils.initTextDocStyle(firstTextDocument);
    }
  })();
}
