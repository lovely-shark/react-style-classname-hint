export type StyleTypes = 'sass' | 'scss' | 'less' | 'styl' | 'css';
export type ParseDocImportStyleResult = Array<{ type: StyleTypes; path: string }>;