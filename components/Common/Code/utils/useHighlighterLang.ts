"use client";
import { useEffect, useState } from "react";
import useLatest from "@lib/hooks/useLatest";
import type { Highlighter, Loader } from "../highlighters";

/**
 * Loads the specified language's highlight syntax, and returns its highlighter-compatible name when loaded.
 */
export default function useHighlighterLang<Lang>(
  highlighter: Loader<Highlighter<unknown, Lang>>,
  languageName: string | undefined,
) {
  const [loadedLang, setLoadedLang] = useState<Lang>();
  const latestName = useLatest(languageName);

  useEffect(() => {
    (async () => {
      const instance = highlighter.current ?? (await highlighter.import());
      const lang = await instance.importLang(languageName);
      if (languageName === latestName.current) setLoadedLang(lang);
    })();
  }, [languageName]);

  return loadedLang;
}
