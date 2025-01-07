// Short class names to use, to minimize initial HTML load
const classShorthands = {
  DEBUG: "_",

  keyword: "k",
  literal: "k",
  symbol: "k",
  name: "k",
  link: "_",

  built_in: "c",
  type: "c",
  number: "n",
  class: "c",
  string: "s",
  regexp: "r",
  ["template-tag"]: "r",

  subst: "_",
  function: "f",
  title: "i",

  params: "p",
  formula: "_",
  comment: "q",
  quote: "_",
  doctag: "_",
  meta: "_",
  tag: "P",

  variable: "i",
  ["template-variable"]: "_",
  attr: "i",
  attribute: "_",
  property: "i",

  section: "_",
  emphasis: "_",
  strong: "_",

  bullet: "_",
  ["selector-tag"]: "_",
  ["selector-id"]: "_",
  ["selector-class"]: "_",
  ["selector-attr"]: "_",
  ["selector-pseudo"]: "_",

  addition: "n",
  deletion: "s",
} as const;

export function mapHljsClass(hljsClass: string[] | undefined) {
  // Map highlight.js's default class names to short ones
  const className = hljsClass?.at(-1)!.replace("_", "");
  const short = classShorthands[className as keyof typeof classShorthands];
  return short ? "sh-" + short : undefined;
}
