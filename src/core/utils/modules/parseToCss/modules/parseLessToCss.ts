import * as less from 'less';

export default function parseLessToCss(cssContent: string) {
  return less.render(cssContent);
}
