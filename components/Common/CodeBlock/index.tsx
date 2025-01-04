import type { LanguageOrIconAlias, PrismLanguage } from "@lib/data/languageIconAliases";
import useCodeProcessor from "./utils/useCodeProcessor";
import importHighlightLanguage from "./utils/importHighlightLanguage";
import useHighlightLanguage from "./utils/useHighlightLanguage";
import CodeBlockContainer from "./Container";
import CodeBlockHighlightRenderer from "./Renderer/highlight";
import CodeBlockPlainRenderer from "./Renderer/plain";
import { rsc } from "rsc-env";

export type { LanguageOrIconAlias, PrismLanguage } from "@lib/data/languageIconAliases";

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
  // Process the code and extract the highlight directives
  const [code, directives] = useCodeProcessor(children);

  /**
   * Highlight syntax import is implemented differently for server and client:
   *
   * Server imports the syntax immediately (async), and only then renders the CodeBlock.
   * This way all of the complex logic remains on the server's side, while the client
   * receives a fully highlighted component, and a small bundle of interactive code.
   *
   * Client uses useHighlightLanguage to import the syntax (useEffect), and then renders.
   * At first, the code is rendered as plain text. The highlighted text is rendered only
   * after the required highlight syntax is imported.
   */

  if (rsc) {
    return importHighlightLanguage(props.lang).then(compositeBlock);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const prismLang = useHighlightLanguage(props.lang);
  return compositeBlock(prismLang);

  // Function for the final CodeBlock component render
  function compositeBlock(prismLang?: PrismLanguage) {
    const Renderer = prismLang ? CodeBlockHighlightRenderer : CodeBlockPlainRenderer;

    return (
      <CodeBlockContainer {...props}>
        <Renderer lang={prismLang!} code={code} directives={directives} nonums={nonums} />
      </CodeBlockContainer>
    );
  }
}
