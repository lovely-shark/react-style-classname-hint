import type { StyleTypes } from '../../typings';

export default function matchCssFileSuffix(path: string): StyleTypes | undefined {
  return path.match(/(?<=\.)[a-z]+?$/)?.[0] as StyleTypes;
}
