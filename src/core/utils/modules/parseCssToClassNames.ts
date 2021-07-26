export default function parseCssToClassNames(cssContent: string): string[] {
  return cssContent.match(/(?<=\.)[\w-_]+/g) ?? [];
}
