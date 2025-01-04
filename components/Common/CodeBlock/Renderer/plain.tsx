import { memo } from "react";
import type { DirectiveInfo } from "../utils/extractHighlightDirectives";
import styles from "./index.module.scss";
import clsx from "clsx";

type HTMLAttrs = React.HTMLAttributes<HTMLElement>;

export interface CodeBlockPlainRendererProps {
  code: string;
  directives?: DirectiveInfo[];
  nonums?: boolean;
}

const CodeBlockPlainRenderer = memo(function CodeBlockPlainRenderer(props: CodeBlockPlainRendererProps) {
  const { code, directives, nonums } = props;

  // Function for getting line props
  const getLineProps = (index: number): HTMLAttrs | undefined => {
    const match = directives?.find(d => d.index === index);
    if (!match) return;
    return {
      className: clsx(styles[match.type as never], match.className),
      style: match.style,
    };
  };

  return (
    <pre className={styles.pre}>
      <code className={clsx(styles.code, nonums && styles.nonums)}>
        {code.split("\n").map((line, index) => (
          <span key={index} {...getLineProps(index)}>
            {line}
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  );
});

export default CodeBlockPlainRenderer;
