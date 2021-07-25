import * as vscode from 'vscode';
import { styleSuffixStr } from './constants';
import type { AllStyleFile } from './store';

export default async function (storeAllStyleFile: AllStyleFile) {
  const styleFiles = await vscode.workspace.findFiles(`**/*.{${styleSuffixStr}}`, 'node_modules');
  storeAllStyleFile.set(styleFiles);
}
