import { findShikiLanguage, type ShikiLanguage } from "@lib/data/languageIconAliases";
import normalizeTokens, { type RefractorToken as LowlightToken } from "../prism/normalizeTokens";
import { createLowlight, type LanguageFn } from "lowlight";
import { mapHljsClass } from "./theme";

/*
 * This is the core highlight.js/lowlight module, that:
 * - Imports the base highlight.js/lowlight functionality, lowlight/createLowlight.
 * - Creates a lowlight instance.
 * - Imports highlighter grammars on demand.
 *
 * This module is lazy-loaded by ../index.ts
 */

const lowlight = createLowlight();

/** Imports a highlight.js/lowlight grammar by a language name or alias, then returns the language's highlight.js/lowlight name. */
export async function importLang(languageName: string | undefined) {
  const lang = findShikiLanguage(languageName);
  if (lang) {
    try {
      let grammar: { default: LanguageFn };
      let getGrammar = importMap[lang];

      // Optionally load the grammar's dependencies on other grammars
      if (Array.isArray(getGrammar)) {
        let dependencies: string[];
        [getGrammar, ...dependencies] = getGrammar;
        [grammar] = await Promise.all([getGrammar(), ...dependencies.map(importLang)]);
      } else {
        grammar = await getGrammar();
      }

      const resolvedName = nameMap[lang] ?? lang;
      lowlight.register(resolvedName, grammar.default);
      return resolvedName;
    } catch (err) {
      console.error(`"${lang}" is not a valid highlight.js/lowlight language.`);
      console.error(err);
    }
  }
}

export const name = "hljs";

export function tokenize(code: string, lang: string) {
  const ast = lowlight.highlight(lang, code, { prefix: "" });
  return normalizeTokens(ast, mapHljsClass);
}
export function renderToken(token: LowlightToken, key: number): React.ReactNode {
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
const importMap: Record<ShikiLanguage, ImportGrammar | GrammarInfo> = {
  tsx: [() => import("highlight.js/lib/languages/typescript"), "html"],
  html: () => import("highlight.js/lib/languages/xml"),
  scss: () => import("highlight.js/lib/languages/scss"),
  csharp: () => import("highlight.js/lib/languages/csharp"),
  fsharp: () => import("highlight.js/lib/languages/fsharp"),
  cpp: () => import("highlight.js/lib/languages/cpp"),
  rust: () => import("highlight.js/lib/languages/rust"),
  python: () => import("highlight.js/lib/languages/python"),
  ini: () => import("highlight.js/lib/languages/ini"),
  xml: () => import("highlight.js/lib/languages/xml"),
  jsonc: () => import("highlight.js/lib/languages/json"),
  yaml: () => import("highlight.js/lib/languages/yaml"),
  csv: () => import("highlight.js/lib/languages/plaintext"),
  markdown: () => import("highlight.js/lib/languages/markdown"),
  mdx: () => import("highlight.js/lib/languages/markdown"),
  latex: () => import("highlight.js/lib/languages/latex"),
  shellscript: () => import("highlight.js/lib/languages/shell"),
  powershell: () => import("highlight.js/lib/languages/powershell"),
  docker: () => import("highlight.js/lib/languages/dockerfile"),
  make: () => import("highlight.js/lib/languages/makefile"),
};
const nameMap: Partial<Record<ShikiLanguage, string>> = {
  tsx: "typescript",
  html: "xml",
  jsonc: "json",
  csv: "plaintext",
  mdx: "markdown",
  shellscript: "shell",
  docker: "dockerfile",
  make: "makefile",
};
