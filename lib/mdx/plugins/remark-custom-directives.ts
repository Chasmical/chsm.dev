import type { Transformer } from "unified";
import type { Nodes } from "mdast";
import type { Directives } from "mdast-util-directive";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import transformIntoMdxJsx from "@lib/mdx/misc/transformIntoMdxJsx";

type DirectiveType = Directives["type"];
type DirectiveTypeShort = "container" | "leaf" | "text";

export interface RemarkCustomDirectivesOptions {
  directives?: CustomDirectiveInfo[];
}
export interface CustomDirectiveInfo {
  type: "container" | "leaf" | "text" | ("container" | "leaf" | "text")[];
  name: string | string[];
  component: string;
  attrName?: string;
  attrValue?: string;
}

export default function remarkCustomDirectives(options?: RemarkCustomDirectivesOptions): Transformer<Nodes> {
  const directives = [...defaultDirectives, ...(options?.directives ?? [])];

  return tree => {
    const directiveTypes: DirectiveType[] = ["containerDirective", "leafDirective", "textDirective"];

    visit(tree, directiveTypes, node => {
      const typeShort = node.type.slice(0, -9) as DirectiveTypeShort;

      // Find a matching directive declaration
      const info = directives.find(dir => {
        return (
          (Array.isArray(dir.type) ? dir.type.includes(typeShort) : dir.type === typeShort) &&
          (Array.isArray(dir.name) ? dir.name.includes(node.name) : dir.name === node.name)
        );
      });
      if (!info) return;

      // Generate and set name and value attributes
      const attrs: Record<string, string> = {};
      info.attrName && (attrs[info.attrName] = node.name);
      info.attrValue && (attrs[info.attrValue] = toString(node));

      // Transform node into a MDX JSX component
      const children = node.children;
      transformIntoMdxJsx(node, info.component, attrs);

      // Re-set children if it's a container/leaf directive (MdxJsx sets them to []),
      // but don't re-set if the children were stringified as a value attribute.
      if (typeShort !== "text" && !info.attrValue) {
        node.children = children;
      }
    });
  };
}

const defaultDirectives: CustomDirectiveInfo[] = [
  { type: "container", name: ["note", "tip", "info", "caution", "danger"], component: "Admonition", attrName: "type" },
  { type: "text", name: "icon", component: "Icon", attrValue: "type" },
  { type: "text", name: "img", component: "img", attrValue: "src" },
  { type: ["container", "leaf", "text"], name: "test", component: "div" },
];
