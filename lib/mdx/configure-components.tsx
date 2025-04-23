import type { MdxComponents } from "@lib/mdx";
import Link from "@components/Common/Link";
import { CodeBlock, InlineCode, InlineCodeProps } from "@components/Common/Code";
import Heading, { HeadingProps } from "@components/Common/Heading";
import InlineCssColor from "@components/Specialized/InlineCssColor";
import Embed from "@components/Specialized/Embed";
import Icon from "@components/Common/Icon";

function makeHeading(depth: 1 | 2 | 3 | 4 | 5 | 6) {
  // eslint-disable-next-line react/display-name
  return (props: HeadingProps) => <Heading {...props} level={depth} />;
}

const preRegex = /^\/\*pre[=:](.+?)\*\//;
const langRegex = /\/\/lang[=:]([a-z0-9-]+(?:@[a-z]+)?)$/;

function InlineCodeWrapper({ children, ...props }: InlineCodeProps) {
  if (typeof children === "string") {
    const matchLang = langRegex.exec(children);
    if (matchLang) {
      [props.lang, props.highlighter] = matchLang[1].split("@") as never[];
      children = children.slice(0, matchLang.index);
    }
    const matchPre = preRegex.exec(children as string);
    if (matchPre) {
      children = matchPre[1] + "\n" + (children as string).slice(matchPre[0].length);
    }
  }

  return <InlineCode {...props}>{children}</InlineCode>;
}

function Image({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  if (src?.slice(0, src.lastIndexOf(".")).endsWith("_2x")) (props.style ??= {}).zoom = 0.5;
  return <img src={src} alt={alt} {...props} />;
}

export default function configureComponents(_config?: unknown): MdxComponents {
  return {
    em: "i",
    strong: "b",
    a: Link,
    img: Image,
    code: InlineCodeWrapper,
    pre: CodeBlock,
    h1: makeHeading(1),
    h2: makeHeading(2),
    h3: makeHeading(3),
    h4: makeHeading(4),
    h5: makeHeading(5),
    h6: makeHeading(6),
    InlineCssColor,
    Embed,
    Icon,
    Admonition: "div", // TODO: add an Admonition component
  };
}
