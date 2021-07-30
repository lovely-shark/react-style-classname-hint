import type { ExtensionContext } from 'vscode';
import initStyleFileListener from './modules/styleFile';
import initActiveTextEditorListener from './modules/activeTextEditor';

export default function registerListener(context: ExtensionContext): void {
  // 初始化样式文件监听器
  initStyleFileListener(context);
  // 初始化激活文件监听器
  initActiveTextEditorListener(context);
}
