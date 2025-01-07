import { DirectiveInfo } from "../utils/extractDirectives";
import type { Highlighter } from "../highlighters";
import { memo, useMemo } from "react";
import styles from "../index.module.scss";
import clsx from "clsx";

export interface CodeRendererProps {
  code: string;
  lang?: string | undefined;
  highlighter?: Highlighter;
  directives?: DirectiveInfo[];
  inline?: boolean;
}

const CodeRenderer = memo(function CodeRenderer(props: CodeRendererProps) {
  const { code, lang, highlighter, directives, inline } = props;

  // Tokenize the code
  const tokens = useMemo(() => {
    return lang ? highlighter!.tokenize(code, lang) : code;
  }, [lang, code]);

  // Function for getting a line's className and style (directives)
  const getLineProps = (index: number): React.HTMLAttributes<HTMLElement> | undefined => {
    const matches = directives?.filter(d => d.index === index);
    if (!matches?.length) return;

    return {
      className: matches.reduce((acc, match) => clsx(acc, styles[match.type as never], match.className), ""),
      style: matches.reduce((acc, match) => Object.assign(acc, match.style), {}),
    };
  };
  const renderTokenLines = (lines: string[] | unknown[][]) => {
    return lines.map((tokens, index) => (
      <span key={index} {...getLineProps(index)}>
        {typeof tokens === "string" ? tokens : tokens.map(highlighter!.renderToken)}
        {"\n"}
      </span>
    ));
  };

  if (typeof tokens === "string") {
    return inline ? tokens.split("\n").at(-1) : renderTokenLines(tokens.split("\n"));
  }
  return inline ? tokens.at(-1)!.map(highlighter!.renderToken) : renderTokenLines(tokens);
});

export default CodeRenderer;
