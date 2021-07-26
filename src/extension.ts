import type { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import registerCompletion from './core/registerCompletion';
import registerListener from './core/registerListener/index';
import { resetStore } from './core/registerListener/modules/activeTextEditor';
import { useStore } from './core/store';

export function activate(context: ExtensionContext) {
  useStore();
  registerListener(context);
  registerCompletion(context);

  // TODO: 初始化需要单独拆成一个函数
  void (function initCurrentOpenEditor() {
    vscode.workspace.textDocuments.some(document => {
      if (/tsx$/.test(document.fileName)) {
        resetStore(document);
        return true;
      }
      return false;
    });
  })();
}
