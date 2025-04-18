// Short class names to use, to minimize initial HTML load
const classShorthands = {
  DEBUG: "_",

  subst: "p",

  punctuation: "p",
  operator: "o",
  keyword: "k",
  literal: "k",
  symbol: "k",
  meta: "k",
  name: "k",
  comment: "q",
  doctag: "k",
  params: "p",
  xml: "p",
  tag: "P",

  built_in: "c",
  type: "c",
  number: "n",
  string: "s",
  regexp: "r",
  title: "i",
  class: "c",
  inherited: "c",
  function: "f",
  invoke: "f",

  formula: "k",
  quote: "q",
  link: "mu",
  section: "mh",
  emphasis: "mi",
  strong: "mb",
  code: "s",
  bullet: "k",

  variable: "i",
  constant: "D",
  language: "i",
  attr: "i",
  attribute: "i",
  property: "i",

  "selector-tag": "g",
  "selector-id": "g",
  "selector-class": "g",
  "selector-pseudo": "g",
  "selector-attr": "i",

  "template-tag": "_",
  "template-variable": "_",

  addition: "n",
  deletion: "s",
} as const;

export function mapHljsClass(hljsClass: string[]) {
  // Map highlight.js's default class names to short ones
  const normalized = hljsClass.map(s => s.replace(/_+$/, ""));
  const className = normalized.findLast(c => c in classShorthands);
  const short = classShorthands[className as keyof typeof classShorthands];
  return "sh-" + (short ?? "_ " + hljsClass.join(" "));
}
