// Short class names to use, to minimize initial HTML load
const classShorthands = {
  DEBUG: "_",

  keyword: "k",
  builtin: "c",
  ["class-name"]: "c",
  function: "f",
  boolean: "k",
  number: "n",
  string: "s",
  char: "s",
  symbol: "_",
  regex: "r",
  ["regex-delimiter"]: "r",
  ["regex-source"]: "r",
  url: "_",
  operator: "o",
  variable: "i",
  constant: "_", // #646695
  property: "_",
  punctuation: "p",
  important: "_",
  comment: "q",

  tag: "t",
  ["attr-name"]: "i",
  ["attr-value"]: "s",
  namespace: "_",
  prolog: "_", // #000080
  doctype: "_",
  cdata: "_",
  entity: "_",

  bold: "_",
  italic: "_",

  atrule: "_",
  selector: "g",
  inserted: "n",
  deleted: "s",

  changed: "k",
  ["interpolation-punctuation"]: "k",
  ["template-punctuation"]: "s",
} as const;

export function mapPrismClass(prismClass: string) {
  // Map Prism's default class names to short ones
  return "sh-" + (classShorthands[prismClass as never] ?? "i");
}
