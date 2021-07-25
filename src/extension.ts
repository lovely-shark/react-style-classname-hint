import type { ExtensionContext } from 'vscode';
import registerCompletion from './core/registerCompletion';
import registerListener from './core/registerListener/index';
import { useStore } from './core/store';
import * as vscode from 'vscode';
import { parseImportStyle } from './core/utils';
import {
  resetStore,
  updateCurrentTextEditorStyle,
} from './core/registerListener/modules/activeTextEditor';

export function activate(context: ExtensionContext) {
  useStore(context);
  registerListener(context);
  registerCompletion(context);
  initCurrentOpenEditor();
}

const initCurrentOpenEditor = () => {
  const firstTextDocuments = vscode.workspace.textDocuments[0];
  if (firstTextDocuments) {
    const path = firstTextDocuments.uri.path;
    resetStore(firstTextDocuments);
  }
};
