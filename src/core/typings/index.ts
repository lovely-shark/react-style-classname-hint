export enum StyleTypes {
  SASS = 'sass',
  SCSS = 'scss',
  LESS = 'less',
  STYL = 'styl',
  CSS = 'css',
}
export type ParseDocImportStyleResult = Array<{ type: StyleTypes; path: string }>;

type ClssName = string;
export type ClassNameSourceLines = Record<
  ClssName,
  {
    sourcePosition: {
      line: number;
      column: number;
    };
    styleContent: string;
  }
>;
