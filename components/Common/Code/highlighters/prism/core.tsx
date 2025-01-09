import { findShikiLanguage, type ShikiLanguage } from "@lib/data/languageIconAliases";
import { refractor, type Syntax as RefractorSyntax } from "refractor/lib/core";
import normalizeTokens, { type PrismToken } from "./normalizeTokens";
import { mapPrismClass } from "./theme";

export type { PrismToken };

/*
 * This is the core Prism/refractor module, that:
 * - Imports the base Prism/refractor functionality, refractor/lib/core.
 * - Imports highlighter grammars on demand.
 *
 * This module is lazy-loaded by ../index.ts
 */

export const name = "prism";

/** Singleton Prism/refractor highlighter */
export { refractor as highlighter };

/** Imports a Prism/refractor grammar by a language name or alias, then returns the language's Prism/refractor name. */
export async function importLang(languageName: string | undefined) {
  const lang = findShikiLanguage(languageName);
  if (lang) {
    try {
      const prismLang = (nameMap[lang as never] ?? lang) as PrismLanguage;
      const grammar = await importMap[prismLang]();
      refractor.register(grammar.default);
      return prismLang;
    } catch (err) {
      console.error(`"${lang}" is not a valid Prism/refractor language.`);
      console.error(err);
    }
  }
}
export function tokenize(code: string, lang: PrismLanguage) {
  const ast = refractor.highlight(code, lang);
  return normalizeTokens(ast, mapPrismClass);
}
export function renderToken(token: PrismToken, key: number): React.ReactNode {
  if (!token.content.trim()) return token.content;

  return (
    <span key={key} className={token.className}>
      {token.content}
    </span>
  );
}

// An import map of some selected grammars, used on the website
const importMap: Record<PrismLanguage, () => Promise<{ default: RefractorSyntax }>> = {
  tsx: () => import("refractor/lang/tsx"),
  markup: () => import("refractor/lang/markup"),
  scss: () => import("refractor/lang/scss"),
  csharp: () => import("refractor/lang/csharp"),
  fsharp: () => import("refractor/lang/fsharp"),
  cpp: () => import("refractor/lang/cpp"),
  rust: () => import("refractor/lang/rust"),
  python: () => import("refractor/lang/python"),
  ini: () => import("refractor/lang/ini"),
  json: () => import("refractor/lang/json"),
  yaml: () => import("refractor/lang/yaml"),
  csv: () => import("refractor/lang/csv"),
  markdown: () => import("refractor/lang/markdown"),
  latex: () => import("refractor/lang/latex"),
  bash: () => import("refractor/lang/bash"),
  powershell: () => import("refractor/lang/powershell"),
  docker: () => import("refractor/lang/docker"),
  makefile: () => import("refractor/lang/makefile"),
};
const nameMap = {
  html: "markup",
  xml: "markup",
  jsonc: "json",
  mdx: "markdown",
  shellscript: "bash",
  make: "makefile",
} as const;

type NameMap = typeof nameMap;

// Ensure that Highlight.js language names map to existing Shiki language names
type _Check<T extends ShikiLanguage = keyof NameMap> = T;

export type PrismLanguage = Exclude<ShikiLanguage, keyof NameMap> | NameMap[keyof NameMap];
