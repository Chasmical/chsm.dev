import { findShikiLanguage, type ShikiLanguage } from "@lib/data/languageIconAliases";
import type { LanguageRegistration } from "shiki";
import { shikiHighlighter } from "./shiki";

export default async function importShikiLanguage(languageName: string | undefined) {
  const lang = findShikiLanguage(languageName);

  try {
    if (lang && !shikiHighlighter.getLoadedLanguages().includes(lang)) {
      const grammar = await importMap[lang]();
      await shikiHighlighter.loadLanguage(grammar);
    }
    return lang;
  } catch (err) {
    console.error(`"${lang}" is not a valid Shiki language.`);
    console.error(err);
  }
}

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
