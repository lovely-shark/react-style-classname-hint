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
        const classNames = findRelatClassNames(keyword);
        classNames.forEach(name => {
          const completionItem = new vscode.CompletionItem(
            name,
            vscode.CompletionItemKind.Constant
          );
          completionItem.command = {
            command: 'editor.action.triggerSuggest',
            title: 'Re-trigger completions...',
          };
          completionList.push(completionItem);
        });
      }
    }
    return completionList;

    function findRelatClassNames(keyword: string): string[] {
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

// const provider1 =
// console.log('开始记时')
// setTimeout(async () => {
//   console.log(vscode.commands.executeCommand('editor.action.triggerSuggest'))
// }, 2000)

// vscode.languages.registerCompletionItemProvider('plaintext', {
//   provideCompletionItems(
//     document: vscode.TextDocument,
//     position: vscode.Position,
//     token: vscode.CancellationToken,
//     context: vscode.CompletionContext
//   ) {
//     const commandCompletion = new vscode.CompletionItem('new222');
//     commandCompletion.kind = vscode.CompletionItemKind.Keyword;
//     commandCompletion.insertText = 'new ';
//     commandCompletion.command = {
//       command: 'editor.action.triggerSuggest',
//       title: 'Re-trigger completions...',
//     };

//     return [commandCompletion];
//   },
// });
