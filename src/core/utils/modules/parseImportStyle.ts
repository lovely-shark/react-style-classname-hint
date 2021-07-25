import type { TextDocument } from 'vscode'
import * as vscode from 'vscode'
import * as path from 'path'

type StyleTypes = 'sass' | 'scss' | 'less' | 'stylu' | 'css'
type ParseImportStyleResult = Array<{ type: StyleTypes; path: string }>

/**
 * 
 * @returns 当前页包含的css文件路径与文件类型(css/less...)
 */
export default function parseImportStyle(document: TextDocument): ParseImportStyleResult {
  const fileContent = document.getText(
    new vscode.Range(new vscode.Position(0, 0), new vscode.Position(document.lineCount + 1, 0))
  )
  const currentFolderPath = path.dirname(document.fileName)

  const parseResult: ParseImportStyleResult = (() => {
    const result: ParseImportStyleResult = []
    const importClassList = fileContent.match(/^(import +)('|")(.+?\.(le|sc|c|sa)ss)('|");?$/gm)
    if (importClassList) {
      importClassList.forEach(importVal => {
        const [styleFileRelativePath] = importVal.match(/(?<=('|"))(.+?)(?=('|");?$)/) ?? []
        if (styleFileRelativePath) {
          const [fileSuffix] = styleFileRelativePath.match(/(?<=\.)[a-z]+?$/) ?? []
          if (fileSuffix) {
            const styleFileAbsPath = path.resolve(currentFolderPath, styleFileRelativePath)
            result.push({
              path: styleFileAbsPath,
              type: fileSuffix as StyleTypes,
            })
          }
        }
      })
    }
    return result
  })()

  return parseResult
}
