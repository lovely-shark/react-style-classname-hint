import type { ExtensionContext } from 'vscode';
import styleFile from './modules/styleFile';
import activeTextEditor from './modules/activeTextEditor';

export default function (context: ExtensionContext): void {
  styleFile(context);
  activeTextEditor(context);
}
