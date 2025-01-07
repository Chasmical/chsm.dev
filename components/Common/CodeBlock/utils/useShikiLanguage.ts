"use client";
import { useEffect, useState } from "react";
import { getShiki, type ShikiLanguage } from "../shiki";

/**
 * Loads the specified language's highlight syntax, and returns its Shiki name when loaded.
 */
export default function useShikiLanguage(languageName: string | undefined) {
  const [loadedLang, setLoadedLang] = useState<ShikiLanguage>();

  useEffect(() => {
    (async () => {
      const shiki = await getShiki();
      const lang = await shiki.importLang(languageName);
      setLoadedLang(lang);
    })();
  }, [languageName]);

  return loadedLang;
}
