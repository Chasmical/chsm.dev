import type { ThemeRegistration } from "shiki";
import { shikiTokenColors } from "./shikiColors";

export function createClassTheme(): ThemeRegistration {
  const tokenColors = shikiTokenColors.map(color => {
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
  });

  return {
    name: "class-theme",
    type: "dark",
    fg: process.env.NODE_ENV === "development" ? "sh-_" : "#9cdcfe",
    bg: "1e1e1e",
    tokenColors: tokenColors.filter(x => x != null),
  };
}

// Short class names to use, to minimize initial HTML load
const classShorthands = {
  DEBUG: "_",

  identifier: "i",
  comment: "q",
  keyword: "k",
  keywordControl: "K",
  operator: "o",
  punctuation: "p",
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
} as const;

export type ClassShorthand = keyof typeof classShorthands;

export interface ShikiTokenColor {
  scope: string | string[];
  settings: {
    fontStyle?: string;
    foreground?: ClassShorthand | `#${string}`;
  };
}
