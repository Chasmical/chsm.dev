import type { LanguageOrIconAlias } from "@lib/data/languageIconAliases";
import Sprite from "@components/Common/Sprite";
import CodeBlockCopyButton from "../CopyButton";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface CodeBlockContainerProps {
  lang?: LanguageOrIconAlias | (string & {});
  title?: string;
  nocopy?: boolean;
  className?: string;
  children?: React.ReactNode;
  // ...props
  style?: React.CSSProperties;
}

export default function CodeBlockContainer({
  title,
  lang,
  nocopy,
  className,
  children,
  ...props
}: CodeBlockContainerProps) {
  return (
    <div role="panel" className={clsx(styles.container, className)} {...props}>
      {title && (
        <div className={styles.header}>
          <Sprite className={styles.fileIcon} src={`/assets/icons/seti/${lang ?? "default"}.svg`} />
          {title}
          {!nocopy && <CodeBlockCopyButton />}
        </div>
      )}
      {!title && !nocopy && <CodeBlockCopyButton float />}
      <pre className={styles.pre}>{children}</pre>
    </div>
  );
}
