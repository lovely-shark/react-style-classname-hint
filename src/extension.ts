import type { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import registerCompletion from './core/registerCompletion';
import registerListener from './core/registerListener/index';
import { resetStore } from './core/registerListener/modules/activeTextEditor';
import { useStore } from './core/store';

export function activate(context: ExtensionContext) {
  useStore(context);
  registerListener(context);
  registerCompletion(context);

  void (function initCurrentOpenEditor() {
    const [firstTextDocuments] = vscode.workspace.textDocuments;
    if (firstTextDocuments) {
      resetStore(firstTextDocuments);
    }
  })();
}
