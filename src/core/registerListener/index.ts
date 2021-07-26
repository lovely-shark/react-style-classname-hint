import type { ExtensionContext } from 'vscode';
import initStyleFileListener from './modules/styleFile';
import initActiveTextEditorListener from './modules/activeTextEditor';

export default function registerListener(context: ExtensionContext): void {
  initStyleFileListener(context);
  initActiveTextEditorListener(context);
}
