import type { ExtensionContext, Uri } from 'vscode';
import * as vscode from 'vscode';
import { styleSuffixStr } from '../../constants/';
import { useStore } from '../../store/';
import {
  parseCssToClassNames, parseLessToCss, parseStylusToCss,
  readCssFileContent
} from '../../utils';

export default function initStyleFileListener(context: ExtensionContext): void {
  const styleFileWatcher = vscode.workspace.createFileSystemWatcher(`**/*.{${styleSuffixStr}}`);
  styleFileWatcher.onDidChange(styleFileChange);
  styleFileWatcher.onDidDelete(styleFileDelete);
  styleFileWatcher.onDidCreate(styleFileCreate);
  return;

  function styleFileChange(u: Uri) {
    if (isContainDepPath(u.path)) return;
    console.log('styleFileChange', u);
    updateFileStyleContent(context, u.path);
  }
  function styleFileDelete(u: Uri) {
    if (isContainDepPath(u.path)) return;
  }
  function styleFileCreate(u: Uri) {
    if (isContainDepPath(u.path)) return;
    console.log('styleFileCreate', u);
  }

  function isContainDepPath(path: string): boolean {
    return /\/node_modules\//.test(path);
  }
}

const hasImported = (ctx: ExtensionContext, fileStyle: Uri['path']): boolean => {
  const state = useStore().storeActiveTextEditor.get();
  return !!state.styleFilePaths.includes(fileStyle);
};

async function resolveStyleContent(stylePath: Uri['path'], styleType: string): Promise<string> {
  let cssContent = readCssFileContent(stylePath);
  switch (styleType) {
    case 'less':
    case 'scss':
      cssContent = (await parseLessToCss(cssContent)).css;
      break;
    case 'sass':
    case 'styl':
      cssContent = await parseStylusToCss(cssContent);
      break;
    case 'css':
      break;
  }
  return cssContent;
}
const getStyleType = (stylePath: Uri['path']) =>
  (stylePath.match(/(?<=\.)[a-z]+?$/) ?? [undefined])[0];

const updateFileStyleContent = async (ctx: ExtensionContext, stylePath: Uri['path']) => {
  if (hasImported(ctx, stylePath)) {
    const { storeActiveTextEditor } = useStore();
    const styleType = getStyleType(stylePath);
    if (styleType) {
      const cssContent = await resolveStyleContent(stylePath, styleType);
      const cssNameList = parseCssToClassNames(cssContent);
      storeActiveTextEditor.updateActiveStyleContent(stylePath, Array.from(new Set(cssNameList)));
      return;
    }
  }
  // 当前更新的样式文件没有被激活的组件引用
};
