import type { LanguageOrIconAlias } from "@lib/data/languageIconAliases";
import { highlighters, type Highlighter, type HighlighterName, type LazyHighlighter } from "../highlighters";
import useHighlighterLang from "./useHighlighterLang";
import { rsc } from "rsc-env";

export type WithHighlighter<T> = Omit<T, "highlighter"> & { highlighter: LazyHighlighter | HighlighterName };

/** Handles the loading of highlighter grammars, differently for server and client. */
export default function withHighlighter(
  hl: LazyHighlighter | HighlighterName | undefined,
  lang: LanguageOrIconAlias | (string & {}) | undefined,
  Component: (highlighter?: Highlighter, lang?: string) => React.ReactNode,
) {
  // No language - no highlighter
  if (!lang) return Component();

  /*
   * Highlight grammar import is implemented differently for server and client:
   *
   * Server imports the grammars immediately (async), and then renders the Component.
   * This way all of the complex logic remains on the server's side, while the client
   * receives a fully highlighted component, and a small bundle of interactive code.
   *
   * Client uses useHighlighterLang to import the grammar, and then renders the Component.
   * At first, the code is rendered as plain text (lang = undefined). The highlighted code
   * is rendered only after the required highlight grammar is imported.
   */

  // Use Shiki highlighting by default
  const loader: LazyHighlighter = (typeof hl === "string" ? highlighters[hl] : hl) ?? highlighters.shiki;

  if (rsc) {
    return loader
      .import()
      .then(h => h.importLang(lang))
      .then(loadedLang => Component(loader.current!, loadedLang));
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const loadedLang = useHighlighterLang(loader, lang);

  return loadedLang && loader.current ? Component(loader.current, loadedLang) : Component();
}
