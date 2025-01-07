import styles from "./index.module.scss";
import clsx from "clsx";

export interface InlineCssColorProps extends React.HTMLAttributes<HTMLElement> {
  color: string;
  className?: string;
  // ...props
  style?: React.CSSProperties;
}

export default function InlineCssColor({ color, className, ...props }: InlineCssColorProps) {
  return (
    <code className={clsx(styles.code, className)} {...props}>
      <span className={styles.color} style={{ backgroundColor: color }} />
      {color}
    </code>
  );
}
