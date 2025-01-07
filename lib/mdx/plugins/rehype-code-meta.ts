import type { Transformer } from "unified";
import type { Element, Nodes } from "hast";
import { visit } from "unist-util-visit";

/**
 * Parses and assigns code blocks' metadata to the nodes' properties.
 *
 * Used to pass the `lang` property and other options to custom code block components.
 */
export default function rehypeCodeMeta(_options?: unknown): Transformer<Nodes> {
  return tree => {
    visit(tree, "element", (codeNode: Element, _index?: number, preNode?) => {
      // Select <pre> nodes with a <code> child
      if (codeNode.tagName !== "code" || preNode?.type !== "element" || preNode.tagName !== "pre") return;

      // Get the node's metadata string
      let meta = codeNode.data?.meta ?? "";

      // Process the highlighter directive: @shiki / @prism
      const highlighterMatch = /^@([a-z]+)/.exec(meta);
      if (highlighterMatch) {
        preNode.properties.highlighter = highlighterMatch[1];
        meta = meta.slice(highlighterMatch[0].length);
      }

      // Parse the metadata attributes and assign them to properties
      Object.assign((preNode.properties ??= {}), parseAttributes(meta));

      // Extract and set the language from className
      const className = String([codeNode.properties?.className].flat()[0]);
      if (className) {
        preNode.properties.lang = className?.replace(/lang(?:uage)?-/, "");
      }
    });
  };
}

const MetaAttributeRegex = /([^\s=]+)(?:="([^"]+)"|=([^\s]+))?/g;

function parseAttributes(meta: string): Record<string, unknown> | undefined {
  if (meta.trim()) {
    const matches = [...meta.matchAll(MetaAttributeRegex)];
    const entries = matches.map(([, key, quoted, unquoted]) => [key, quoted ?? unquoted ?? true]);
    return Object.fromEntries(entries);
  }
}
