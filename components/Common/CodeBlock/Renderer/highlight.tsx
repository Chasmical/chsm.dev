import { createElement, memo, useMemo } from "react";
import { refractor } from "refractor";
import type { PrismLanguage } from "@lib/data/languageIconAliases";
import type { DirectiveInfo } from "../utils/extractHighlightDirectives";
import normalizeTokens, { type RefractorRoot, type RefractorToken } from "../utils/normalizeTokens";
import { typescriptAstFixes } from "../utils/refractorAstFixes";
import styles from "./index.module.scss";
import clsx from "clsx";
import "./vsDarkTheme.scss";

type HTMLAttrs = React.HTMLAttributes<HTMLElement>;

export interface CodeBlockHighlightRendererProps {
  lang: PrismLanguage | (string & {});
  code: string;
  directives?: DirectiveInfo[];
  nonums?: boolean;
}

const CodeBlockHighlightRenderer = memo(function CodeBlockHighlightRenderer(props: CodeBlockHighlightRendererProps) {
  const { code, directives, lang, nonums } = props;

  // Transform the code into a Refractor AST, and group the resulting tokens by line
  const tokens = useMemo(() => {
    const ast = refractor.highlight(code, lang) as RefractorRoot;

    if (lang === "typescript" || lang === "tsx") {
      typescriptAstFixes(ast);
    }

    return normalizeTokens(ast);
  }, [code, lang]);

  // Functions for getting line and token props
  const getLineProps = (index: number): HTMLAttrs | undefined => {
    const matches = directives?.filter(d => d.index === index);
    if (!matches?.length) return;

    return {
      className: matches.reduce((acc, match) => clsx(acc, styles[match.type as never], match.className), ""),
      style: matches.reduce((acc, match) => Object.assign(acc, match.style), {}),
    };
  };

  const renderTokens = (tokens: RefractorToken[]) => {
    return tokens.map((token, i) => renderToken(token, i));
  };
  const renderToken = (token: RefractorToken, key: number): React.ReactNode => {
    if (token.type === "text") return token.value;
    const props = { key, className: token.properties.className.join(" ") };
    return createElement(token.tagName, props, token.children.map(renderToken));
  };

  return (
    <pre className={clsx(styles.pre, "refractor", `language-${lang}`)}>
      <code className={clsx(styles.code, nonums && styles.nonums)}>
        {tokens.map((line, index) => (
          <span key={index} {...getLineProps(index)}>
            {renderTokens(line)}
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  );
});

export default CodeBlockHighlightRenderer;
