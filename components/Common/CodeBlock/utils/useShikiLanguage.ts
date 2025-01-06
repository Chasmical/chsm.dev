"use client";
import { useEffect, useState } from "react";
import importShikiLanguage from "./importShikiLanguage";
import type { ShikiLanguage } from "@lib/data/languageIconAliases";

/**
 * Loads the specified language's highlight syntax, and returns its Shiki name when loaded.
 */
export default function useShikiLanguage(languageName: string | undefined) {
  const [loadedLang, setLoadedLang] = useState<ShikiLanguage>();

  useEffect(() => {
    importShikiLanguage(languageName).then(lang => setLoadedLang(lang));
  }, [languageName]);

  return loadedLang;
}
