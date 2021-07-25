import * as fs from 'fs'
import type { Uri } from 'vscode'

export default function readUriContent(file: Uri) {
  return fs.readFileSync(file.path).toString()
}
