export default function parseStyleToClassNames(cssContent: string): string[] {
  return cssContent.match(/(?<=\.)[\w-_]+/g) ?? [];
}
