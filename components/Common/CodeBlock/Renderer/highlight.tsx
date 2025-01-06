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
  inline?: boolean;
  // ...props
  className?: string;
  style?: React.CSSProperties;
}

const CodeBlockHighlightRenderer = memo(function CodeBlockHighlightRenderer(props: CodeBlockHighlightRendererProps) {
  const { code, directives, lang, nonums, inline, className, style } = props;

  // Highlight the code with Shiki
  const tokens = useMemo(() => {
    return shiki.codeToTokens(code, {
      lang: lang as ShikiLanguage,
      theme: "class-theme",
      includeExplanation: process.env.NODE_ENV === "development",
    }).tokens;
  }, [code, lang]);

  // Function for getting a line's className and style (directives)
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
  // Function to render one line of themed tokens (shiki)
  const renderLine = (tokens: ThemedToken[], index: number) => {
    return (
      <span key={index} {...getLineProps(index)}>
        {tokens.map(renderToken)}
        {"\n"}
      </span>
    );
  };

  let style2 = style;
  if (!inline && !nonums) {
    // If there's a lot of lines, increase the gutter's width to fit all the line numbers
    const lineNumDigits = Math.ceil(Math.log10(tokens.length));
    if (lineNumDigits > 2) (style2 ??= {})["--line-num-digits"] = lineNumDigits;
  }

  return (
    <code
      className={clsx(
        inline ? styles.inline : styles.block,
        nonums && styles.nonums,
        "shiki language-" + lang,
        className,
      )}
      style={style2}
    >
      {inline ? tokens[0].map(renderToken) : tokens.map(renderLine)}
    </code>
  );
});

export default CodeBlockHighlightRenderer;

declare global {
  namespace React {
    interface CSSProperties {
      ["--line-num-digits"]?: number;
    }
  }
}
