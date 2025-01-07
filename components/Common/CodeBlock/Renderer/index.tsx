import { memo, useMemo } from "react";
import type { DirectiveInfo } from "../utils/extractDirectives";
import { getShikiSync, type ShikiToken, type ShikiLanguage } from "../shiki";
import styles from "./index.module.scss";
import clsx from "clsx";
import "./themeDarkModern.scss";

export interface CodeBlockRendererProps {
  lang: ShikiLanguage | (string & {});
  code: string;
  directives?: DirectiveInfo[];
  inline?: boolean;
}

const CodeBlockRenderer = memo(function CodeBlockRenderer(props: CodeBlockRendererProps) {
  const { lang, code, directives, inline } = props;

  // Highlight the code with Shiki
  const tokens = useMemo(() => {
    // Grammar not loaded or not required, return string
    if (!lang) return code;

    // Assume that Shiki and the required grammars are already loaded
    const { highlighter } = getShikiSync()!;

    return highlighter.codeToTokens(code, {
      lang,
      theme: "class-theme",
      includeExplanation: process.env.NODE_ENV === "development",
    }).tokens;
  }, [code, lang]);

  // Function for getting a line's className and style (directives)
  const getLineProps = (index: number): React.HTMLAttributes<HTMLElement> | undefined => {
    const matches = directives?.filter(d => d.index === index);
    if (!matches?.length) return;

    return {
      className: matches.reduce((acc, match) => clsx(acc, styles[match.type as never], match.className), ""),
      style: matches.reduce((acc, match) => Object.assign(acc, match.style), {}),
    };
  };
  const renderTokenLines = (tokens: string[] | ShikiToken[][]) => {
    return tokens.map((tokens, index) => (
      <span key={index} {...getLineProps(index)}>
        {typeof tokens === "string" ? tokens : tokens.map(renderToken)}
        {"\n"}
      </span>
    ));
  };
  // Function to render a Shiki token
  const renderToken = (token: ShikiToken, key: number): React.ReactNode => {
    if (!token.content.trim()) return token.content;

    if (process.env.NODE_ENV === "development" && token.color?.includes("_")) {
      console.log(token.explanation);
    }

    return (
      <span key={key} className={token.color}>
        {token.content}
      </span>
    );
  };

  if (typeof tokens === "string") {
    return inline ? tokens.split("\n").at(-1) : renderTokenLines(tokens.split("\n"));
  }
  return inline ? tokens.at(-1)!.map(renderToken) : renderTokenLines(tokens);
});

export default CodeBlockRenderer;
