import { memo, useMemo } from "react";
import type { ShikiLanguage } from "@lib/data/languageIconAliases";
import type { DirectiveInfo } from "../utils/extractDirectives";
import type { ThemedToken } from "shiki";
import { shiki } from "../utils/shiki";
import styles from "./index.module.scss";
import clsx from "clsx";
import "./themeDarkModern.scss";

type HTMLAttrs = React.HTMLAttributes<HTMLElement>;

export interface CodeBlockHighlightRendererProps {
  lang: ShikiLanguage | (string & {});
  code: string;
  directives?: DirectiveInfo[];
  nonums?: boolean;
}

const CodeBlockHighlightRenderer = memo(function CodeBlockHighlightRenderer(props: CodeBlockHighlightRendererProps) {
  const { code, directives, lang, nonums } = props;

  // Highlight the code with Shiki
  const tokens = useMemo(() => {
    return shiki.codeToTokens(code, {
      lang: lang as ShikiLanguage,
      theme: "class-theme",
      includeExplanation: process.env.NODE_ENV === "development",
    }).tokens;
  }, [code, lang]);

  // Function for getting the specified line's className and style (directives)
  const getLineProps = (index: number): HTMLAttrs | undefined => {
    const matches = directives?.filter(d => d.index === index);
    if (!matches?.length) return;

    return {
      className: matches.reduce((acc, match) => clsx(acc, styles[match.type as never], match.className), ""),
      style: matches.reduce((acc, match) => Object.assign(acc, match.style), {}),
    };
  };

  // Function to render a themed token (shiki)
  const renderToken = (token: ThemedToken, key: number): React.ReactNode => {
    if (!token.content.trim()) return token.content;

    if (process.env.NODE_ENV === "development" && token.color?.includes("TODO")) {
      console.log(token.explanation);
    }

    return (
      <span key={key} className={token.color}>
        {token.content}
      </span>
    );
  };

  return (
    <pre className={clsx(styles.pre, "shiki", `language-${lang}`)}>
      <code className={clsx(styles.code, nonums && styles.nonums)}>
        {tokens.map((line, index) => (
          <span key={index} {...getLineProps(index)}>
            {line.map((token, i) => renderToken(token, i))}
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  );
});

export default CodeBlockHighlightRenderer;
