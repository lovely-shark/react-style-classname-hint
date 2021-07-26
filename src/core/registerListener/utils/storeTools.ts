import { ExtensionContext, Uri } from 'vscode';
import { useStore } from '../../store';
import { parseStyleToClassNames } from '../../utils';
import { resolveStyleContent } from './styleTools';

export const getStyleType = (stylePath: Uri['path']) =>
  (stylePath.match(/(?<=\.)[a-z]+?$/) ?? [undefined])[0];

export const hasImported = (ctx: ExtensionContext, fileStyle: Uri['path']): boolean => {
  const state = useStore().storeActiveTextEditor.get();
  return !!state.styleFilePaths.includes(fileStyle);
};

export const updateFileStyleContent = async (ctx: ExtensionContext, stylePath: Uri['path']) => {
  if (hasImported(ctx, stylePath)) {
    const { storeActiveTextEditor } = useStore();
    const styleType = getStyleType(stylePath);
    if (styleType) {
      const cssContent = await resolveStyleContent(stylePath, styleType);
      const cssNameList = parseStyleToClassNames(cssContent);
      storeActiveTextEditor.updateActiveStyleFile(stylePath, Array.from(new Set(cssNameList)));
      return;
    }
  }
  // 当前更新的样式文件没有被激活的组件引用
};
