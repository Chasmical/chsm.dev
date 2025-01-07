import { useMemo } from "react";
import type { LanguageOrIconAlias, ShikiLanguage } from "@lib/data/languageIconAliases";
import { getShiki } from "./shiki";
import stringifyChildren from "./utils/stringifyChildren";
import extractDirectives from "./utils/extractDirectives";
import useShikiLanguage from "./utils/useShikiLanguage";
import CodeBlockContainer from "./Container";
import CodeBlockRenderer from "./Renderer";
import { rsc } from "rsc-env";
import styles from "./Renderer/index.module.scss";
import clsx from "clsx";

export type { LanguageOrIconAlias, ShikiLanguage } from "@lib/data/languageIconAliases";

export interface CodeBlockProps {
  lang?: LanguageOrIconAlias | (string & {});
  children?: React.ReactNode;
  inline?: boolean;
  // ...props
  title?: string;
  nonums?: boolean;
  nocopy?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function CodeBlock({ lang: langName, children, inline, nonums, ...props }: CodeBlockProps) {
  // Stringify the children and extract directives
  const [code, directives] = useMemo(() => {
    const lines = stringifyChildren(children);
    const directives = inline ? undefined : extractDirectives(lines);

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
      .then(shiki => shiki.importLang(langName))
      .then(composite);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const shikiLang = useShikiLanguage(langName);
  return composite(shikiLang);

  // Function for the final CodeBlock component render
  function composite(shikiLang?: ShikiLanguage) {
    const renderer = <CodeBlockRenderer lang={shikiLang!} code={code} directives={directives} inline={inline} />;

    if (inline) {
      return (
        <code {...props} className={clsx(styles.inline, shikiLang && "shiki language-" + shikiLang, props.className)}>
          {renderer}
        </code>
      );
    }

    return (
      <CodeBlockContainer lang={langName} {...props}>
        <code className={clsx(styles.block, nonums && styles.nonums, shikiLang && "shiki language-" + shikiLang)}>
          {renderer}
        </code>
      </CodeBlockContainer>
    );
  }
}
