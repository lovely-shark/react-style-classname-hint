import * as stylus from 'stylus';

export default function parseStylusToCss(cssContent: string) {
  return new Promise<string>((resolve, reject) => {
    stylus.render(cssContent, { filename: 'nesting.css' }, function (err, cssResult) {
      if (err) reject(err);
      else resolve(cssResult);
    });
  });
}
