import type { MdxComponents } from "@lib/mdx";
import Link from "@components/Common/Link";
import CodeBlock, { CodeBlockProps, ShikiLanguage } from "@components/Common/CodeBlock";
import Heading, { HeadingProps } from "@components/Common/Heading";
import InlineCssColor from "@components/Specialized/InlineCssColor";
import Embed from "@components/Specialized/Embed";
import Icon from "@components/Common/Icon";

function makeHeading(depth: 1 | 2 | 3 | 4 | 5 | 6) {
  // eslint-disable-next-line react/display-name
  return (props: HeadingProps) => <Heading {...props} level={depth} />;
}

const preRegex = /^\/\*pre[=:](.+?)\*\//;
const langRegex = /\/\/lang[=:]([a-z0-9-]+)$/;

function InlineCode({ children, ...props }: CodeBlockProps) {
  let lang: ShikiLanguage | undefined;
  if (typeof children === "string") {
    const matchLang = langRegex.exec(children);
    if (matchLang) {
      lang = matchLang[1] as ShikiLanguage;
      children = children.slice(0, matchLang.index);
    }
    const matchPre = preRegex.exec(children as string);
    if (matchPre) {
      children = matchPre[1] + "\n" + (children as string).slice(matchPre[0].length);
    }
  }
  return (
    <CodeBlock lang={lang} {...props} inline>
      {children}
    </CodeBlock>
  );
}

export default function configureComponents(_config?: unknown): MdxComponents {
  return {
    em: "i",
    strong: "b",
    a: Link,
    code: InlineCode,
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
