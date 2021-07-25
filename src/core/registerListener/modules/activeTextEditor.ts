import type { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { useStore } from '../../store';
import {
  parseImportStyle,
  parseLessToCss,
  parseSassToCss,
  parseStyleToClassNames,
  parseStylusToCss,
  readCssFileContent,
  ThrottleFn,
} from '../../utils';

export default function (context: ExtensionContext) {
  const { storeActiveTextEditor } = useStore();
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      const { path } = editor.document.uri;
      if (/(tsx|js|ts)$/.test(path)) {
        storeActiveTextEditor.initState();
        storeActiveTextEditor.setCurrentActiveFilePath(path);
        const currentFileStyles = parseImportStyle(editor.document);
        updateCurrentTextEditorStyle(currentFileStyles);
      }
    }
  });

  void (function () {
    const changeThrottle = new ThrottleFn();
    vscode.workspace.onDidChangeTextDocument(textDocument => {
      changeThrottle.exec(2000, () => {
        const { currentActiveFilePath } = storeActiveTextEditor.get();
        if (currentActiveFilePath === textDocument.document.fileName) {
          const currentFileStyles = parseImportStyle(textDocument.document);
          const oldActiveStyleFilePaths = storeActiveTextEditor.get().styleFilePaths;
          const newActiveStyleFilePaths = currentFileStyles.map(item => item.path);

          const needRemoveFilePaths = oldActiveStyleFilePaths.filter(
            path => !newActiveStyleFilePaths.includes(path)
          );
          const needUpdateFileStyles = newActiveStyleFilePaths
            .filter(path => !oldActiveStyleFilePaths.includes(path))
            .map(path => currentFileStyles.find(item => item.path === path)!);

          needRemoveFilePaths.forEach(path => storeActiveTextEditor.removeActiveStyleFile(path));
          updateCurrentTextEditorStyle(needUpdateFileStyles);
        }
      });
    });
  })();

  return;

  function updateCurrentTextEditorStyle(
    updateFileStyles: ReturnType<typeof parseImportStyle>
  ): void {
    updateFileStyles.forEach(async style => {
      try {
        let cssContent = readCssFileContent(style.path);
        switch (style.type) {
          case 'less':
          case 'scss':
            cssContent = (await parseLessToCss(cssContent)).css;
            break;
          case 'sass':
          case 'stylu':
            cssContent = await parseStylusToCss(cssContent);
            break;
          case 'css':
            break;
        }
        storeActiveTextEditor.updateActiveStyleFile(
          style.path,
          Array.from(new Set(parseStyleToClassNames(cssContent)))
        );
      } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(`${style.path}存在问题`);
      }
    });
  }
}
