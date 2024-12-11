import { createElement, memo, useMemo } from "react";
import { refractor } from "refractor";
import normalizeTokens, { type RefractorElement, type RefractorToken } from "../utils/normalizeTokens";
import styles from "./index.module.scss";
import clsx from "clsx";
import "./vsDarkTheme.scss"; // TODO: turn the theme into a config of some sort

type HTMLAttrs = React.HTMLAttributes<HTMLElement>;

export interface CodeBlockHighlightRendererProps {
  code: string;
  lang: string;
  highlightLines?: number[];
  nonums?: boolean;
}

const CodeBlockHighlightRenderer = memo(function CodeBlockHighlightRenderer(props: CodeBlockHighlightRendererProps) {
  const { code, highlightLines, lang, nonums } = props;

  // Transform the code into a Refractor AST, and group the resulting tokens by line
  const tokens = useMemo(() => {
    return normalizeTokens(refractor.highlight(code, lang));
  }, [code, lang]);

  // Functions for getting line and token props
  const getLineProps = (index: number): HTMLAttrs => {
    return { className: highlightLines?.includes(index) ? styles.highlighted : undefined };
  };
  const getTokenProps = (token: RefractorToken): HTMLAttrs => {
    token = token as RefractorElement;
    const { className: classNames, ...props } = token.properties;
    return { className: classNames.join(" "), children: token.children.map(renderToken), ...props };
  };
  const renderToken = (token: RefractorToken): React.ReactNode => {
    return token.type === "text" ? token.value : createElement(token.tagName, getTokenProps(token));
  };

  return (
    <pre className={clsx(styles.pre, "refractor", `language-${lang}`)}>
      <code className={clsx(styles.code, nonums && styles.nonums)}>
        {tokens.map((line, index) => (
          <span key={index} {...getLineProps(index)}>
            {line.map((token, index) => (
              <span key={index} {...getTokenProps(token)} />
            ))}
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  );
});

export default CodeBlockHighlightRenderer;
