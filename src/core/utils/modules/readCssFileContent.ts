import * as fs from 'fs';

export default function readCssFileContent(path: string) {
  return fs.readFileSync(path).toString();
}
