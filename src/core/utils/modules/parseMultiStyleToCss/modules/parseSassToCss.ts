import { renderSync } from 'sass';

export default function parseSassToCss(file: string) {
  const convertCss = renderSync({ file });
  return convertCss.css.toString();
}
