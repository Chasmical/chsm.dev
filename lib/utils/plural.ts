export function isPlural(count: number) {
  return count % 10 != 1 || count % 100 == 11;
}

/** Return either the singular or the plural form of the word (`item` or `items`) */
export default function plural(word: string, count: number): string;
/** Puts the count in front of the word (`1 item` or `5 items`) */
export default function plural(count: number, word: string): string;

export default function plural(word: string | number, count: string | number) {
  if (typeof word === "number") {
    return word + " " + plural(count as string, word);
  }
  return isPlural(count as number) ? word.replace(/(?<=\w)(\W*)$/, (_, ws) => "s" + ws) : word;
}
