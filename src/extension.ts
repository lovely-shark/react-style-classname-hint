import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import registerCompletion from './core/registerCompletion';
import registerListener from './core/registerListener/index';
import { useStore } from './core/store';

export function activate(context: ExtensionContext) {
  useStore(context);
  // registerCompletion(context)
  registerCompletion;
  registerListener(context);
  context.subscriptions.push();
}
