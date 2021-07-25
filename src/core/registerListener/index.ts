import type { ExtensionContext } from 'vscode';
import createStyleFileWatcher from './modules/styleFile';
import activeTextEditor from './modules/activeTextEditor';

export default function (context: ExtensionContext): void {
  createStyleFileWatcher(context);
  activeTextEditor(context);
}
