import * as path from 'path'
import type { CompletionItem, Position, TextDocument, ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import * as fs from 'fs'

const completionTriggerChars = `'".-_abcdefghijklmnopqrstuvwxyz1234567890 `
const completionTriggerLanguages = ['typescript', 'typescriptreact', 'javascript']

// const completionList: CompletionItem[] = completionTriggerLanguages.map(
//   (language) => {
// vscode.languages.registerCompletionItemProvider(
//   "typescript",
//   {
//     provideCompletionItems(document: TextDocument, position: Position) {
//       console.log("拥有你");

//       const allContent = document.getText(
//         new vscode.Range(
//           new vscode.Position(0, 0),
//           new vscode.Position(document.lineCount + 1, 0)
//         )
//       );
//       const currentFilePath = path.dirname(document.fileName);
//       const imClassList = allContent.match(
//         /import.+?('|")(.+?\.(le|sc|c|sa)ss)('|");?$/gm
//       ) ?? [undefined];
//       if (imClassList) {
//         const completionList: CompletionItem[] = [];
//         imClassList.forEach((imClass) => {
//           if (!imClass) return;
//           const [fileName] = imClass.match(/(?<="|').+?(?="|')/) ?? [undefined];
//           if (fileName) {
//             const cssFile = fs
//               .readFileSync(path.resolve(currentFilePath, fileName))
//               .toString();
//             const classNameList = cssFile.match(/(?<=\.)[\w-_]+/g);
//             if (classNameList) {
//               return classNameList.map((name) =>
//                 completionList.push(
//                   new vscode.CompletionItem(
//                     name,
//                     vscode.CompletionItemKind.Color
//                   )
//                 )
//               );
//             }
//           }
//         });
//         return completionList;
//       }
//       console.log("刻在我心底的名字");
//       const linePrefix = document
//         .lineAt(position)
//         .text.substr(0, position.character);
//     },
//   },
//   ...completionTriggerChars
// );
//   }
// );
export default function (context: ExtensionContext) {
  // setInterval(() => {
  //   console.log('context', context.workspaceState.get('one'))
  // }, 2000)
}

// const provider1 = vscode.languages.registerCompletionItemProvider('plaintext', {
//   provideCompletionItems(
//     document: vscode.TextDocument,
//     position: vscode.Position,
//     token: vscode.CancellationToken,
//     context: vscode.CompletionContext
//   ) {
//     const commandCompletion = new vscode.CompletionItem('new222')
//     commandCompletion.kind = vscode.CompletionItemKind.Keyword
//     commandCompletion.insertText = 'new '
//     commandCompletion.command = {
//       command: 'editor.action.triggerSuggest',
//       title: 'Re-trigger completions...',
//     }

//     return [commandCompletion]
//   },
// })
// console.log('开始记时')
// setTimeout(async () => {
//   console.log(vscode.commands.executeCommand('editor.action.triggerSuggest'))
// }, 2000)
