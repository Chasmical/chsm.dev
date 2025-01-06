import { memo } from "react";
import type { DirectiveInfo } from "../utils/extractDirectives";
import styles from "./index.module.scss";
import clsx from "clsx";

type HTMLAttrs = React.HTMLAttributes<HTMLElement>;

export interface CodeBlockPlainRendererProps {
  code: string;
  directives?: DirectiveInfo[];
  nonums?: boolean;
  inline?: boolean;
  // ...props
  className?: string;
  style?: React.CSSProperties;
}

const CodeBlockPlainRenderer = memo(function CodeBlockPlainRenderer(props: CodeBlockPlainRendererProps) {
  const { code, directives, nonums, inline, className, style } = props;
  const lines = code.split("\n");

  // Function for getting a line's className and style (directives)
  const getLineProps = (index: number): HTMLAttrs | undefined => {
    const matches = directives?.filter(d => d.index === index);
    if (!matches?.length) return;

    return {
      className: matches.reduce((acc, match) => clsx(acc, styles[match.type as never], match.className), ""),
      style: matches.reduce((acc, match) => Object.assign(acc, match.style), {}),
    };
  };
  // Function to render one line of plain text
  const renderLine = (line: string, index: number) => {
    return (
      <span key={index} {...getLineProps(index)}>
        {line}
        {"\n"}
      </span>
    );
  };

  let style2 = style;
  if (!inline && !nonums) {
    // If there's a lot of lines, increase the gutter's width to fit all the line numbers
    const lineNumDigits = Math.ceil(Math.log10(lines.length));
    if (lineNumDigits > 2) (style2 ??= {})["--line-num-digits"] = lineNumDigits;
  }

  return (
    <code className={clsx(inline ? styles.inline : styles.block, nonums && styles.nonums, className)} style={style2}>
      {inline ? lines[0] : lines.map(renderLine)}
    </code>
  );
});

export default CodeBlockPlainRenderer;
