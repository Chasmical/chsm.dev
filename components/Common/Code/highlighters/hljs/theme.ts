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
  quote: "mq",
  link: "mu",
  section: "mh",
  emphasis: "mi",
  strong: "mb",
  code: "mc",
  bullet: "ml",

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
  const className = hljsClass.at(-1)!.replace(/_+$/, "");
  const short = classShorthands[className as keyof typeof classShorthands];
  return "sh-" + (short ?? "_ " + hljsClass.join(" "));
}
