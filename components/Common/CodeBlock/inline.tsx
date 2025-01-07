import { useMemo } from "react";
import type { LanguageOrIconAlias, ShikiLanguage } from "@lib/data/languageIconAliases";
import { getShiki } from "./shiki";
import stringifyChildren from "./utils/stringifyChildren";
import useShikiLanguage from "./utils/useShikiLanguage";
import CodeBlockPlainRenderer from "./Renderer/plain";
import CodeBlockHighlightRenderer from "./Renderer/highlight";
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
  // Stringify the children
  const code = useMemo(() => stringifyChildren(children).join("\n"), [children]);

  if (rsc) {
    return getShiki()
      .then(shiki => shiki.importLang(lang))
      .then(compositeInline);
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
