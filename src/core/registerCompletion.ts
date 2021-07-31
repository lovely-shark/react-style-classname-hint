import type { CompletionItem, ExtensionContext, Position, TextDocument } from 'vscode';
import * as vscode from 'vscode';
import { StoreActiveTextEditor } from './store';
import { ClassNameSourceLines } from './typings';

const completionTriggerChars = `'".-_abcdefghijklmnopqrstuvwxyz1234567890 `;
const completionTriggerLanguages = ['typescript', 'typescriptreact', 'javascript'];

// 注册编辑器自动完成事件
export default function registerCompletion(context: ExtensionContext): void {
  const triggerCompletionList = completionTriggerLanguages.map(language =>
    vscode.languages.registerCompletionItemProvider(
      language,
      { provideCompletionItems: handleProvideCompletion },
      ...completionTriggerChars
    )
  );

  context.subscriptions.push(...triggerCompletionList);

  return;

  // 对文本输入内容做样式提示
  function handleProvideCompletion(document: TextDocument, position: Position) {
    const linePrefixStr = document.lineAt(position).text.substr(0, position.character);
    const completionList: CompletionItem[] = [];
    const verifyIsEditClassNameReg = /^.*className=(('|")|(\{))[^'"\}]*$/;
    if (verifyIsEditClassNameReg.test(linePrefixStr)) {
      const lastKeywordReg = /[^ '"\{]*$/;
      const [keyword] = linePrefixStr.match(lastKeywordReg) ?? [undefined];
      if (keyword) {
        const classNameSources = findRelateClassNameSources(keyword);
        Object.entries(classNameSources).forEach(([className, classNameSource]) => {
          const completionItem = new vscode.CompletionItem(
            className,
            vscode.CompletionItemKind.Text
          );
          // completionItem.documentation = classNameSource.styleContent;
          completionItem.detail = classNameSource.styleContent;
          completionList.push(completionItem);
        });
      }
    }
    return completionList;

    // 查找与输入的关键字相关的名字和对应的内容
    function findRelateClassNameSources(keyword: string): ClassNameSourceLines {
      const storeActiveTextEditor = StoreActiveTextEditor.getStore;
      const { styleClassNameMap } = storeActiveTextEditor.get();
      const matchRegStr = keyword.split('').join('.*');
      const findResult: ClassNameSourceLines = {};
      styleClassNameMap.forEach(classNameSourceLine => {
        Object.entries(classNameSourceLine).forEach(([className, classNameSource]) => {
          if (new RegExp(`${matchRegStr}`).test(className)) findResult[className] = classNameSource;
        });
      });
      return findResult;
    }
  }
}
