import NextLink from "next/link";
import styles from "./index.module.scss";
import clsx from "clsx";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingType = `h${HeadingLevel}`;

interface BaseHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6 | (number & {});
  className?: string;
  children?: React.ReactNode;
  // ...props
  style?: React.CSSProperties;
  itemProp?: "headline"; // add types as needed
  linkItemProp?: "url";
}
export type HeadingProps = BaseHeadingProps & ({ id: string; href?: never } | { id?: never; href: string });

export default function Heading({ level, id, href, className, children, linkItemProp, ...props }: HeadingProps) {
  const Element = `h${level}` as HeadingType;

  return (
    <Element id={id} className={clsx(styles.heading, className)} {...props}>
      <NextLink href={href ?? "#" + id} itemProp={linkItemProp}>
        {children}
        <LinkIcon />
      </NextLink>
    </Element>
  );
}

function LinkIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 128 128" height="0.7em" width="0.7em">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        d="M72,56 L72,56c11,11,11,29,0,40l-16,16c-11,11-29,11-40,0l0,0c-11-11-11-29,0-40 l14-14 M56,72 L56,72c-11-11-11-29,0-40l16-16c11-11,29-11,40,0l0,0c11,11,11,29,0,40 l-14,14"
      />
    </svg>
  );
}
