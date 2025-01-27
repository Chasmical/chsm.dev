"use client";
import { useEffect, useState } from "react";
import useLatest from "@lib/hooks/useLatest";
import type { Highlighter, LazyHighlighter } from "../highlighters";

/**
 * Loads the specified language's highlight syntax, and returns its highlighter-compatible name when loaded.
 */
export default function useHighlighterLang<Lang extends string>(
  loader: LazyHighlighter<Lang, unknown>,
  languageName: string | undefined,
) {
  const [loadedLang, setLoadedLang] = useState<Lang>();
  const [_, setProcessedHighlighter] = useState<Highlighter>();
  const latestName = useLatest(languageName);

  useEffect(() => {
    (async () => {
      const highlighter = await loader.import();
      const lang = await highlighter.importLang(languageName);
      if (languageName === latestName.current) {
        setLoadedLang(lang);
        setProcessedHighlighter(highlighter);
      }
    })();
  }, [loader, languageName]);

  return loadedLang;
}
