import { findShikiLanguage, type ShikiLanguage } from "@lib/data/languageIconAliases";
import { refractor, type Syntax as RefractorSyntax } from "refractor/lib/core";
import normalizeTokens, { type RefractorToken } from "./normalizeTokens";
import { mapPrismClass } from "./theme";

/*
 * This is the core Prism/refractor module, that:
 * - Imports the base Prism/refractor functionality, refractor/lib/core.
 * - Imports highlighter grammars on demand.
 *
 * This module is lazy-loaded by ../index.ts
 */

/** Imports a Prism/refractor grammar by a language name or alias, then returns the language's Prism/refractor name. */
export async function importLang(languageName: string | undefined) {
  const lang = findShikiLanguage(languageName);
  if (lang) {
    try {
      const grammar = await importMap[lang]();
      refractor.register(grammar.default);
      return nameMap[lang] ?? lang;
    } catch (err) {
      console.error(`"${lang}" is not a valid Prism/refractor language.`);
      console.error(err);
    }
  }
}

export const name = "prism";

export function tokenize(code: string, lang: string) {
  const ast = refractor.highlight(code, lang);
  return normalizeTokens(ast, mapPrismClass);
}
export function renderToken(token: RefractorToken, key: number): React.ReactNode {
  if (!token.content.trim()) return token.content;

  return (
    <span key={key} className={token.className}>
      {token.content}
    </span>
  );
}

// An import map of some selected grammars, used on the website
const importMap: Record<ShikiLanguage, () => Promise<{ default: RefractorSyntax }>> = {
  tsx: () => import("refractor/lang/tsx"),
  html: () => import("refractor/lang/markup"),
  scss: () => import("refractor/lang/scss"),
  csharp: () => import("refractor/lang/csharp"),
  fsharp: () => import("refractor/lang/fsharp"),
  cpp: () => import("refractor/lang/cpp"),
  rust: () => import("refractor/lang/rust"),
  python: () => import("refractor/lang/python"),
  ini: () => import("refractor/lang/ini"),
  xml: () => import("refractor/lang/markup"),
  jsonc: () => import("refractor/lang/json"),
  yaml: () => import("refractor/lang/yaml"),
  csv: () => import("refractor/lang/csv"),
  markdown: () => import("refractor/lang/markdown"),
  mdx: () => import("refractor/lang/markdown"),
  latex: () => import("refractor/lang/latex"),
  shellscript: () => import("refractor/lang/bash"),
  powershell: () => import("refractor/lang/powershell"),
  docker: () => import("refractor/lang/docker"),
  make: () => import("refractor/lang/makefile"),
};
const nameMap: Partial<Record<ShikiLanguage, string>> = {
  html: "markup",
  xml: "markup",
  jsonc: "json",
  mdx: "markdown",
  shellscript: "bash",
  make: "makefile",
};
