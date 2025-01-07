import type { ShikiLanguage } from "@lib/data/languageIconAliases";
import type { HighlighterCore, ThemedToken as ShikiToken } from "shiki/core";

export type { ShikiLanguage, ShikiToken };

export interface ShikiInstance {
  highlighter: HighlighterCore;
  importLang: (lang: string | undefined) => Promise<ShikiLanguage | undefined>;
}

let shiki: ShikiInstance | undefined;

/**
 * Lazily imports the Shiki singleton, which contains the highlighter, the class theme and grammar imports.
 */
export const getShiki = async () => (shiki ??= await import("./core"));
/**
 * Synchronously gets the cached Shiki singleton.
 */
export const getShikiSync = () => shiki;
