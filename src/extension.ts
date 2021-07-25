import type { ExtensionContext } from 'vscode';
import initStyleFile from './core/initStyleFile';
import registerCompletion from './core/registerCompletion';
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
