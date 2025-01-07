import { findShikiLanguage, type ShikiLanguage } from "@lib/data/languageIconAliases";
import { createHighlighterCore, type LanguageRegistration } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import classTheme from "./theme";

/*
 * This is the core Shiki module, that:
 * - Imports the base Shiki functionality, shiki/core.
 * - Imports the onigurama engine factory, shiki/engune/oniguruma.
 * - Imports the onigurama WASM, shiki/wasm.
 * - Initializes a highlighter with a class theme.
 *
 * This module is lazy-loaded by methods in ./index.ts
 */

/** Singleton Shiki highlighter */
export const highlighter = await createHighlighterCore({
  langs: [],
  themes: [classTheme],
  engine: createOnigurumaEngine(import("shiki/wasm")),
});

/** Imports a Shiki grammar by a language name or alias, then returns the language's Shiki name. */
export async function importLang(languageName: string | undefined) {
  const lang = findShikiLanguage(languageName);
  if (lang) {
    try {
      const grammar = await importMap[lang]();
      await highlighter.loadLanguage(grammar);
      return lang;
    } catch (err) {
      console.error(`"${lang}" is not a valid Shiki language.`);
      console.error(err);
    }
  }
}

// An import map of some selected grammars, used on the website
const importMap: Record<ShikiLanguage, () => Promise<{ default: LanguageRegistration[] }>> = {
  tsx: () => import("@shikijs/langs/tsx"),
  html: () => import("@shikijs/langs/html"),
  scss: () => import("@shikijs/langs/scss"),
  csharp: () => import("@shikijs/langs/csharp"),
  fsharp: () => import("@shikijs/langs/fsharp"),
  cpp: () => import("@shikijs/langs/cpp"),
  rust: () => import("@shikijs/langs/rust"),
  python: () => import("@shikijs/langs/python"),
  ini: () => import("@shikijs/langs/ini"),
  xml: () => import("@shikijs/langs/xml"),
  jsonc: () => import("@shikijs/langs/jsonc"),
  yaml: () => import("@shikijs/langs/yaml"),
  csv: () => import("@shikijs/langs/csv"),
  markdown: () => import("@shikijs/langs/markdown"),
  mdx: () => import("@shikijs/langs/mdx"),
  latex: () => import("@shikijs/langs/latex"),
  shellscript: () => import("@shikijs/langs/shellscript"),
  powershell: () => import("@shikijs/langs/powershell"),
  docker: () => import("@shikijs/langs/docker"),
  make: () => import("@shikijs/langs/make"),
};
