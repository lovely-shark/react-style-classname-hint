import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import registerCompletion from './core/registerCompletion';
import initStyleFile from './core/initStyleFile';
import registerListener from './core/registerListener/index';
import { useStore } from './core/store';

export function activate(context: ExtensionContext) {
  const { storeAllStyleFile } = useStore(context);
  // registerCompletion(context)
  registerCompletion;
  registerListener(context);
  initStyleFile(storeAllStyleFile);
  context.subscriptions.push();
}
