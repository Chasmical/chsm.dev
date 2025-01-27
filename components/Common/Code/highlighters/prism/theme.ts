// Short class names to use, to minimize initial HTML load
const classShorthands = {
  DEBUG: "_",

  keyword: "k",
  builtin: "c",
  "class-name": "c",
  function: "f",
  "function-variable": "f",
  boolean: "k",
  number: "n",
  string: "s",
  char: "s",
  symbol: "_",
  regex: "r",
  "regex-delimiter": "r",
  "regex-source": "r",
  "regex-flags": "k",
  url: "mu",
  operator: "o",
  variable: "i",
  interpolation: "i",
  constant: "D",
  property: "i",
  punctuation: "p",
  important: "_",
  comment: "q",

  tag: "t",
  "attr-name": "i",
  "attr-value": "s",
  namespace: "c",
  prolog: "q",
  hashbang: "q",
  preprocessor: "k",
  directive: "k",
  doctype: "_",
  expression: "i",
  "format-string": "i",
  cdata: "P",
  entity: "k",
  "plain-text": "p",
  script: "i",
  spread: "i",
  "script-punctuation": "p",
  "code-snippet": "s",
  "code-block": "s",
  "code-language": "i",
  title: "mh",
  list: "k",
  blockquote: "q",

  bold: "mb",
  italic: "mi",
  content: "i",

  atrule: "_",
  selector: "g",
  inserted: "n",
  deleted: "s",
  changed: "k",

  "interpolation-punctuation": "k",
  "template-punctuation": "s",
} as const;

export function mapPrismClass(prismClass: string[]) {
  // Map Prism's default class names to short ones
  const className = prismClass.find(c => c in classShorthands);
  const short = classShorthands[className as keyof typeof classShorthands];
  return "sh-" + (short ?? "_ " + prismClass.join(" "));
}
