import type { CompletionItem, ExtensionContext, Position, TextDocument } from 'vscode';
import * as vscode from 'vscode';
import { useStore } from './store';

const completionTriggerChars = `'".-_abcdefghijklmnopqrstuvwxyz1234567890 `;
const completionTriggerLanguages = ['typescript', 'typescriptreact', 'javascript'];

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

  function handleProvideCompletion(document: TextDocument, position: Position) {
    const linePrefixStr = document.lineAt(position).text.substr(0, position.character);
    const completionList: CompletionItem[] = [];
    const verifyIsEditClassNameReg = /^.*className=(('|")|(\{))[^'"\}]*$/;
    if (verifyIsEditClassNameReg.test(linePrefixStr)) {
      const lastKeywordReg = /[^ '"\{]*$/;
      const [keyword] = linePrefixStr.match(lastKeywordReg) ?? [undefined];
      if (keyword) {
        const classNames = findRelateClassNames(keyword);
        classNames.forEach(name => {
          const completionItem = new vscode.CompletionItem(name, vscode.CompletionItemKind.Text);
          completionList.push(completionItem);
        });
      }
    }
    return completionList;

    function findRelateClassNames(keyword: string): string[] {
      const { storeActiveTextEditor } = useStore();
      const { styleClassNameMap } = storeActiveTextEditor.get();
      const matchRegStr = keyword.split('').join('.*');
      let findResult: string[] = [];
      Object.values(styleClassNameMap).map(classNames => {
        findResult = classNames.filter(name => new RegExp(`${matchRegStr}`).test(name));
      });
      return findResult;
    }
  }
}
