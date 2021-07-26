import type { ExtensionContext } from 'vscode';
import registerCompletion from './core/registerCompletion';
import registerListener from './core/registerListener/index';
import { useStore } from './core/store';
import * as vscode from 'vscode';

export function activate(context: ExtensionContext) {
  useStore();
  registerListener(context);
  registerCompletion(context);

  // TODO: 初始化需要单独拆成一个函数
  void (function initCurrentOpenEditor() {
    const { storeActiveTextEditor } = useStore();
    const [firstTextDocument] = vscode.workspace.textDocuments;
    if (/tsx$/.test(firstTextDocument?.fileName)) {
      storeActiveTextEditor.utils.initTextDocStyle(firstTextDocument);
    }
  })();
}
