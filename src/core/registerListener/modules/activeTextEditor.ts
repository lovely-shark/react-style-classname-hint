import type { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import type { StyleFileType } from '../../store';
import { useStore } from '../../store';
import parseImportStyle from '../../utils/modules/parseImportStyle';
import parseStyleToClassNames from '../../utils/modules/parseStyleToClassNames';
import { parseLessToCss, parseSassToCss, parseStylusToCss } from '../../utils/modules/parseToCss';
import readUriContent from '../../utils/modules/readUriContent';
import ThrottleFn from '../../utils/modules/throttleFn';

export default function (context: ExtensionContext) {
  console.log('也许你都忘了');
  const { storeActiveTextEditor, storeAllStyleFile } = useStore();
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      const { path } = editor.document.uri;
      if (/(tsx|js|ts)$/.test(path)) {
        storeActiveTextEditor.setCurrentActiveFilePath(path);
        const allStyleFile = storeAllStyleFile.get();
        const currentFileStyles = parseImportStyle(editor.document);
        updateCurrentTextEditorStyle(allStyleFile, currentFileStyles);
        console.log('initActiveTextEditor', storeActiveTextEditor.get());
      }
    }
  });

  void (function () {
    const changeThrottle = new ThrottleFn();
    vscode.workspace.onDidChangeTextDocument(textDocument => {
      changeThrottle.exec(2000, () => {
        console.log('延时');

        const { currentActiveFilePath } = storeActiveTextEditor.get();
        if (currentActiveFilePath === textDocument.document.fileName) {
          const allStyleFile = storeAllStyleFile.get();
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
          updateCurrentTextEditorStyle(allStyleFile, needUpdateFileStyles);
          console.log('allStyleFile', storeActiveTextEditor.get());
        }
      });
    });
  })();

  return;

  function updateCurrentTextEditorStyle(
    allStyleFile: StyleFileType[],
    updateFileStyles: ReturnType<typeof parseImportStyle>
  ): void {
    updateFileStyles.forEach(async style => {
      const styleUri = allStyleFile.find(item => style.path === item.path);
      if (styleUri) {
        let cssContent = readUriContent(styleUri);
        try {
          switch (style.type) {
            case 'scss':
            case 'sass':
              cssContent = parseSassToCss(cssContent);
              break;
            case 'less':
              cssContent = (await parseLessToCss(cssContent)).css;
              break;
            case 'stylu':
              cssContent = await parseStylusToCss(cssContent);
              break;
            case 'css':
              break;
          }
          storeActiveTextEditor.updateActiveStyleFile(
            style.path,
            parseStyleToClassNames(cssContent)
          );
        } catch (error) {
          vscode.window.showErrorMessage(`${style.path}存在问题`);
        }
      }
    });
  }
}
