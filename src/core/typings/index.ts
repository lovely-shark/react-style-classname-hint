export enum StyleTypes {
  SASS = 'sass',
  SCSS = 'scss',
  LESS = 'less',
  STYL = 'styl',
  CSS = 'css',
}
export type ParseDocImportStyleResult = Array<{ type: StyleTypes; path: string }>;

export interface ClassNameContent {
  originPosition: {
    line: number;
    column: number;
  };
  styleContent: string;
}

type ClssName = string;
export type ClassNameContentMap = Record<ClssName, ClassNameContent>;
