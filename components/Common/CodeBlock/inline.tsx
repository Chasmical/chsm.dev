import type { LanguageOrIconAlias, ShikiLanguage } from "@lib/data/languageIconAliases";
import importShikiLanguage from "./utils/importShikiLanguage";
import useShikiLanguage from "./utils/useShikiLanguage";
import { stringifyChildren } from "./utils/useCodeProcessor";
import CodeBlockHighlightRenderer from "./Renderer/highlight";
import CodeBlockPlainRenderer from "./Renderer/plain";
import { rsc } from "rsc-env";

export type { LanguageOrIconAlias, ShikiLanguage } from "@lib/data/languageIconAliases";

export interface InlineCodeBlockProps {
  lang?: LanguageOrIconAlias | (string & {});
  children?: React.ReactNode;
  // ...props
  className?: string;
  style?: React.CSSProperties;
}

export default function InlineCodeBlock({ lang, children, ...props }: InlineCodeBlockProps) {
  const code = stringifyChildren(children).join(" ");

  if (rsc) {
    return importShikiLanguage(lang).then(compositeInline);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const shikiLang = useShikiLanguage(lang);
  return compositeInline(shikiLang);

  // Function for the final CodeBlock component render
  function compositeInline(shikiLang?: ShikiLanguage) {
    const Renderer = shikiLang ? CodeBlockHighlightRenderer : CodeBlockPlainRenderer;

    return <Renderer lang={shikiLang!} code={code} inline {...props} />;
  }
}
