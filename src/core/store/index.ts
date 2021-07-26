import ActiveTextEditor from './modules/activeTextEditor';

interface RootStoreType {
  storeActiveTextEditor: ActiveTextEditor;
}

// TODO: 未来可能改为inject方式
let rootStore: RootStoreType | null = null;
export const useStore = () =>
  rootStore ??
  (rootStore = {
    storeActiveTextEditor: new ActiveTextEditor(),
  });

export type { default as ActiveStyleFile } from './modules/activeTextEditor';
