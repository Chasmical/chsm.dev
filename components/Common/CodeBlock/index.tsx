import { useMemo } from "react";
import type { LanguageOrIconAlias, ShikiLanguage } from "@lib/data/languageIconAliases";
import { getShiki } from "./shiki";
import stringifyChildren from "./utils/stringifyChildren";
import extractDirectives from "./utils/extractDirectives";
import useShikiLanguage from "./utils/useShikiLanguage";
import CodeBlockContainer from "./Container";
import CodeBlockPlainRenderer from "./Renderer/plain";
import CodeBlockHighlightRenderer from "./Renderer/highlight";
import { rsc } from "rsc-env";

export type { LanguageOrIconAlias, ShikiLanguage } from "@lib/data/languageIconAliases";

export interface CodeBlockProps {
  lang?: LanguageOrIconAlias | (string & {});
  nonums?: boolean;
  children?: React.ReactNode;
  // ...props
  title?: string;
  nocopy?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function CodeBlock({ children, nonums, ...props }: CodeBlockProps) {
  // Stringify the children and extract directives
  const [code, directives] = useMemo(() => {
    const lines = stringifyChildren(children);
    const directives = extractDirectives(lines);

    return [lines.join("\n"), directives];
  }, [children]);

  /*
   * Highlight grammar import is implemented differently for server and client:
   *
   * Server imports the grammar immediately (async), and only then renders the CodeBlock.
   * This way all of the complex logic remains on the server's side, while the client
   * receives a fully highlighted component, and a small bundle of interactive code.
   *
   * Client uses useHighlightLanguage to import the grammar (useEffect), and then renders.
   * At first, the code is rendered as plain text. The highlighted text is rendered only
   * after the required highlight grammar is imported.
   */

  if (rsc) {
    return getShiki()
      .then(shiki => shiki.importLang(props.lang))
      .then(compositeBlock);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const shikiLang = useShikiLanguage(props.lang);
  return compositeBlock(shikiLang);

  // Function for the final CodeBlock component render
  function compositeBlock(shikiLang?: ShikiLanguage) {
    const Renderer = shikiLang ? CodeBlockHighlightRenderer : CodeBlockPlainRenderer;

    return (
      <CodeBlockContainer {...props}>
        <Renderer lang={shikiLang!} code={code} directives={directives} nonums={nonums} />
      </CodeBlockContainer>
    );
  }
}
