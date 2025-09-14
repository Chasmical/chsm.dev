import type { ThemeRegistration } from "shiki";
import { ShikiTokenColor, shikiTokenColors } from "./themeColors";

// Short class names to use, to minimize initial HTML load
const classShorthands = {
  DEBUG: "_",

  identifier: "i",
  constant: "D",
  comment: "q",
  keyword: "k",
  keywordControl: "K",
  operator: "o",
  punctuation: "p",
  plainText: "p",
  punctuationTag: "P",

  number: "n",
  string: "s",
  regexp: "r",
  regexp2: "R",
  regexp3: "g",
  regexp4: "G",

  entityTag: "t",
  entityClass: "c",
  entityComponent: "C",
  entityFunction: "f",

  markupHeading: "mh",
  markupBold: "mb",
  markupItalic: "mi",
  markupUnderline: "mu",
  markupQuote: "q",
} as const;

export type ClassShorthand = keyof typeof classShorthands;

function mapTokenColor(color: ShikiTokenColor) {
  const foreground = color.settings.foreground;

  // Return non-color rules as is
  if (!foreground) return color;

  // Remove raw hex colors (unstyled)
  if (foreground.startsWith("#")) return null;

  // Convert full class names into shorthands
  return {
    scope: color.scope,
    settings: {
      foreground: "sh-" + classShorthands[foreground as never],
    },
  };
}

// The class-based color theme
const classTheme: ThemeRegistration = {
  name: "class-theme",
  type: "dark",
  fg: process.env.NODE_ENV === "development" ? "sh-_" : "#9cdcfe",
  bg: "1e1e1e",
  tokenColors: shikiTokenColors.map(mapTokenColor).filter(x => x != null),
};
export default classTheme;
