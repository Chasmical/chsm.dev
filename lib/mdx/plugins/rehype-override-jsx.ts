import type { Transformer } from "unified";
import type { Nodes } from "hast";
import { visit } from "unist-util-visit";

/**
 * Allows overriding native elements created through JSX syntax in markdown with custom components.
 *
 * By default, MDX only converts markdown nodes into custom components, and leaves JSX as is.
 *
 * https://github.com/mdx-js/mdx/pull/2052#issuecomment-1140519087
 */
export default function rehypeOverrideJsx(_options?: unknown): Transformer<Nodes> {
  interface MaybeMdxNode {
    data?: { _mdxExplicitJsx?: boolean };
  }
  return tree => {
    visit(tree, node => void delete (node as MaybeMdxNode).data?._mdxExplicitJsx);
  };
}
