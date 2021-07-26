import type { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { useStore } from '../../store';
import {
  parseDocImportStyle,
  parseLessToCss,
  parseCssToClassNames,
  parseStylusToCss,
  readCssFileContent,
  ThrottleFn,
} from '../../utils';

export default function initActiveTextEditorListener(context: ExtensionContext) {
  const { storeActiveTextEditor } = useStore();
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      resetStore(editor.document);
    }
  });

  void (function () {
    const changeThrottle = new ThrottleFn();
    vscode.workspace.onDidChangeTextDocument(textDocument => {
      changeThrottle.exec(2000, () => {
        const { currentActiveFilePath, styleFilePaths } = storeActiveTextEditor.get();
        if (currentActiveFilePath === textDocument.document.fileName) {
          const currentFileStyles = parseDocImportStyle(textDocument.document);
          const oldActiveStyleFilePaths = styleFilePaths;
          const newActiveStyleFilePaths = currentFileStyles.map(item => item.path);

          const needRemoveFilePaths = oldActiveStyleFilePaths.filter(
            path => !newActiveStyleFilePaths.includes(path)
          );
          const needUpdateFileStyles = newActiveStyleFilePaths
            .filter(path => !oldActiveStyleFilePaths.includes(path))
            .map(path => currentFileStyles.find(item => item.path === path)!);

          needRemoveFilePaths.forEach(path => storeActiveTextEditor.removeActiveStyleContent(path));
          updateCurrentTextEditorStyle(needUpdateFileStyles);
        }
      });
    });
  })();

  return;
}
export const resetStore = (document: vscode.TextDocument) => {
  const { storeActiveTextEditor } = useStore();
  const { path } = document.uri;
  if (/(tsx|js|ts)$/.test(path)) {
    storeActiveTextEditor.resetState();
    storeActiveTextEditor.setCurrentActiveFilePath(path);
    const currentFileStyles = parseDocImportStyle(document);
    updateCurrentTextEditorStyle(currentFileStyles);
  }
};

export function updateCurrentTextEditorStyle(
  updateFileStyles: ReturnType<typeof parseDocImportStyle>
): void {
  const { storeActiveTextEditor } = useStore();
  updateFileStyles.forEach(async style => {
    try {
      let cssContent = readCssFileContent(style.path);
      switch (style.type) {
        case 'less':
        case 'scss':
          cssContent = (await parseLessToCss(cssContent)).css;
          break;
        case 'sass':
        case 'styl':
          cssContent = await parseStylusToCss(cssContent);
          break;
        case 'css':
          break;
      }
      storeActiveTextEditor.updateActiveStyleContent(
        style.path,
        Array.from(new Set(parseCssToClassNames(cssContent)))
      );
    } catch (error) {
      console.log(error);
      vscode.window.showErrorMessage(`${style.path}存在问题`);
    }
  });
}
