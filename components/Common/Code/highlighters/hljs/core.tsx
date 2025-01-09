import { findShikiLanguage, type ShikiLanguage } from "@lib/data/languageIconAliases";
import normalizeTokens, { type PrismToken as HljsToken } from "../prism/normalizeTokens";
import { createLowlight, type LanguageFn } from "lowlight";
import { mapHljsClass } from "./theme";

export type { HljsToken };
/*
 * This is the core highlight.js/lowlight module, that:
 * - Imports the base highlight.js/lowlight functionality, lowlight/createLowlight.
 * - Creates a lowlight instance.
 * - Imports highlighter grammars on demand.
 *
 * This module is lazy-loaded by ../index.ts
 */

export const name = "hljs";

/** Singleton highlight.js/lowlight highlighter */
export const highlighter = createLowlight();

/** Imports a highlight.js/lowlight grammar by a language name or alias, then returns the language's highlight.js/lowlight name. */
export async function importLang(languageName: string | undefined) {
  const lang = findShikiLanguage(languageName);
  if (lang) {
    try {
      let grammar: { default: LanguageFn };
      const hljsLang = (nameMap[lang as never] ?? lang) as HljsLanguage;
      let getGrammar = importMap[hljsLang];

      // Optionally load the grammar's dependencies on other grammars
      if (Array.isArray(getGrammar)) {
        let dependencies: string[];
        [getGrammar, ...dependencies] = getGrammar;
        [grammar] = await Promise.all([getGrammar(), ...dependencies.map(importLang)]);
      } else {
        grammar = await getGrammar();
      }

      highlighter.register(hljsLang, grammar.default);
      return hljsLang;
    } catch (err) {
      console.error(`"${lang}" is not a valid highlight.js/lowlight language.`);
      console.error(err);
    }
  }
}
export function tokenize(code: string, lang: HljsLanguage) {
  const ast = highlighter.highlight(lang, code, { prefix: "" });
  return normalizeTokens(ast, mapHljsClass);
}
export function renderToken(token: HljsToken, key: number): React.ReactNode {
  if (!token.content.trim() || !token.className) return token.content;

  return (
    <span key={key} className={token.className}>
      {token.content}
    </span>
  );
}

type ImportGrammar = () => Promise<{ default: LanguageFn }>;
type GrammarInfo = ImportGrammar | [ImportGrammar, ...dependencies: string[]];

// An import map of some selected grammars, used on the website
const importMap: Record<HljsLanguage, ImportGrammar | GrammarInfo> = {
  typescript: [() => import("highlight.js/lib/languages/typescript"), "html"],
  xml: () => import("highlight.js/lib/languages/xml"),
  scss: () => import("highlight.js/lib/languages/scss"),
  csharp: () => import("highlight.js/lib/languages/csharp"),
  fsharp: () => import("highlight.js/lib/languages/fsharp"),
  cpp: () => import("highlight.js/lib/languages/cpp"),
  rust: () => import("highlight.js/lib/languages/rust"),
  python: () => import("highlight.js/lib/languages/python"),
  ini: () => import("highlight.js/lib/languages/ini"),
  json: () => import("highlight.js/lib/languages/json"),
  yaml: () => import("highlight.js/lib/languages/yaml"),
  plaintext: () => import("highlight.js/lib/languages/plaintext"),
  markdown: () => import("highlight.js/lib/languages/markdown"),
  latex: () => import("highlight.js/lib/languages/latex"),
  shell: () => import("highlight.js/lib/languages/shell"),
  powershell: () => import("highlight.js/lib/languages/powershell"),
  dockerfile: () => import("highlight.js/lib/languages/dockerfile"),
  makefile: () => import("highlight.js/lib/languages/makefile"),
};
const nameMap = {
  tsx: "typescript",
  html: "xml",
  jsonc: "json",
  csv: "plaintext",
  mdx: "markdown",
  shellscript: "shell",
  docker: "dockerfile",
  make: "makefile",
} as const;

type NameMap = typeof nameMap;

// Ensure that Highlight.js language names map to existing Shiki language names
type _Check<T extends ShikiLanguage = keyof NameMap> = T;

export type HljsLanguage = Exclude<ShikiLanguage, keyof NameMap> | NameMap[keyof NameMap];
