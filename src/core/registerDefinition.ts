import type { DefinitionLink, ExtensionContext, Position, TextDocument } from 'vscode';
import * as vscode from 'vscode';
import { hintTriggerLanguages } from './constants';
import { StoreActiveTextEditor } from './store';
import { ClassNameContent } from './typings';

type ClassNamePathContents = Array<{
  styleFilePath: string;
  classNameContent: ClassNameContent;
}>;

export default function registerDefinition(context: ExtensionContext): void {
  const triggerDefinitionList = hintTriggerLanguages.map(language =>
    vscode.languages.registerDefinitionProvider(language, {
      provideDefinition: handleProvideDefinition,
    })
  );

  context.subscriptions.push(...triggerDefinitionList);

  return;

  function handleProvideDefinition(document: TextDocument, position: Position): DefinitionLink[] {
    const linePrefixStr = document.lineAt(position).text.substr(0, position.character);

    const definitionLinks: DefinitionLink[] = [];

    const verifyIsEditClassNameReg = /^.*className=(('|")|(\{))[^'"\}]*$/;
    if (verifyIsEditClassNameReg.test(linePrefixStr)) {
      const lineSuffixStr = document.lineAt(position).text.substr(position.character);
      const prefixWordReg = /[^ '"\{]*$/;
      const suffixWordReg = /^[^ '"\{]*/;

      const [prefixWord] = linePrefixStr.match(prefixWordReg) ?? [''];
      const [suffixWord] = lineSuffixStr.match(suffixWordReg) ?? [''];
      const focusClassName = prefixWord + suffixWord;

      const classNameContents = findRelateClassNameContents(focusClassName);
      classNameContents.forEach(content => {
        const { line, column } = content.classNameContent.originPosition;
        definitionLinks.push({
          originSelectionRange: new vscode.Range(
            position.line,
            position.character - prefixWord.length,
            position.line,
            position.character + suffixWord.length
          ),
          targetUri: vscode.Uri.file(content.styleFilePath),
          targetRange: new vscode.Range(line - 1, column, line - 1, column),
        });
      });
    }

    return definitionLinks;

    /**
     *
     * @param className 类名称
     * @returns 查找到与className相关的 样式文件 与 类名对应的内容
     */
    function findRelateClassNameContents(className: string): ClassNamePathContents {
      const storeActiveTextEditor = StoreActiveTextEditor.getStore;
      const { styleClassNameMap } = storeActiveTextEditor.get();
      const classNameContents: ClassNamePathContents = [];

      styleClassNameMap.forEach((classNameContentMap, styleFilePath) => {
        const classNameContent = classNameContentMap[className];
        if (classNameContent) {
          classNameContents.push({
            styleFilePath,
            classNameContent,
          });
        }
      });

      return classNameContents;
    }
  }
}
