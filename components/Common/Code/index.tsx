import { useMemo } from "react";
import type { Highlighter, HighlighterName, Loader } from "./highlighters";
import type { LanguageOrIconAlias } from "@lib/data/languageIconAliases";
import stringifyChildren from "./utils/stringifyChildren";
import extractDirectives from "./utils/extractDirectives";
import withHighlighter from "./utils/withHighlighter";
import CodeBlockContainer from "./BlockContainer";
import CodeRenderer from "./Renderer";
import styles from "./index.module.scss";
import clsx from "clsx";
import "./themeDarkModern.scss";

export interface CodeBlockProps {
  children: React.ReactNode;
  highlighter?: Loader<Highlighter> | HighlighterName;
  // ...container props
  lang?: LanguageOrIconAlias | (string & {});
  title?: string;
  nonums?: boolean;
  nocopy?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CodeBlock(allProps: CodeBlockProps) {
  const { children, highlighter, ...props } = allProps;

  // Stringify the children and extract directives
  const [code, directives] = useMemo(() => {
    const lines = stringifyChildren(children);
    const directives = extractDirectives(lines);
    return [lines.join("\n"), directives];
  }, [children]);

  return withHighlighter(highlighter, props.lang, (highlighter, lang) => {
    return (
      <CodeBlockContainer {...props}>
        <code className={clsx(styles.block, lang && [highlighter.name, "language-" + lang])}>
          <CodeRenderer code={code} lang={lang} highlighter={highlighter} directives={directives} />
        </code>
      </CodeBlockContainer>
    );
  });
}

export interface InlineCodeProps {
  children: React.ReactNode;
  highlighter?: Loader<Highlighter> | HighlighterName;
  lang?: LanguageOrIconAlias | (string & {});
  className?: string;
  // ...props
  style?: React.CSSProperties;
}

export function InlineCode(allProps: InlineCodeProps) {
  const { children, highlighter, lang, className, ...props } = allProps;

  // Stringify the children and extract directives
  const code = useMemo(() => stringifyChildren(children).join("\n"), [children]);

  return withHighlighter(highlighter, lang, (highlighter, lang) => {
    return (
      <code className={clsx(styles.inline, lang && [highlighter.name, "language-" + lang], className)} {...props}>
        <CodeRenderer code={code} lang={lang} highlighter={highlighter} inline />
      </code>
    );
  });
}
