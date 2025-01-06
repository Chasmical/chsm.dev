import { findShikiLanguage } from "@lib/data/languageIconAliases";
import { shiki } from "./shiki";

export default async function importShikiLanguage(languageName: string | undefined) {
  const lang = findShikiLanguage(languageName);

  try {
    if (lang && !shiki.getLoadedLanguages().includes(lang)) {
      await shiki.loadLanguage(lang);
    }
    return lang;
  } catch (err) {
    console.error(`"${lang}" is not a valid Shiki language.`);
    console.error(err);
  }
}
