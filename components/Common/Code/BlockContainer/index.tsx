import type { LanguageOrIconAlias } from "@lib/data/languageIconAliases";
import Icon from "@components/Common/Icon";
import Sprite from "@components/Common/Sprite";
import CodeCopyButton from "../CopyButton";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface CodeBlockContainerProps {
  lang?: LanguageOrIconAlias | (string & {});
  title?: string;
  nonums?: boolean;
  nocopy?: boolean;
  className?: string;
  children?: React.ReactNode;
  // ...props
  style?: React.CSSProperties;
}

export default function CodeBlockContainer(allProps: CodeBlockContainerProps) {
  const { lang, title, nonums, nocopy, className, children, ...props } = allProps;

  return (
    <div role="panel" className={clsx(styles.container, className)} {...props}>
      {title && (
        <div className={styles.header}>
          <Sprite className={styles.fileIcon} src={`/assets/icons/seti/${lang ?? "default"}.svg`} />
          {title}
          {!nocopy && <CodeCopyButton icon={<Icon type="copy" size={24} />} />}
        </div>
      )}
      {!title && !nocopy && <CodeCopyButton float icon={<Icon type="copy" size={24} />} />}
      <pre className={clsx(styles.pre, nonums && "nonums")}>{children}</pre>
    </div>
  );
}
