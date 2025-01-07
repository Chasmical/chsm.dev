import type { RefractorRoot, RefractorElement as RfElem, Text } from "refractor";
import type { Root } from "hast";

type RefractorElement = Omit<RfElem, "children"> & {
  properties: { className: string[] };
  children: (RefractorElement | Text)[];
};

export type RefractorToken = { content: string; className?: string };

const newLineRegex = /\r?\n|\r/g;

/**
 * Transforms the Refractor's AST into a 2D array of tokens, grouped by line.
 */
export default function normalizeTokens(
  ast: RefractorRoot | Root,
  mapClassName: (className: string[] | undefined) => string | undefined,
): RefractorToken[][] {
  let traversingLine: RefractorToken[] = [];
  const traversedLines = [traversingLine];

  // Traverse the entire tree and build a list of nodes grouped by line
  function traverse(parent: RefractorElement) {
    const className = mapClassName(parent.properties?.className);

    for (const child of parent.children) {
      if (child.type === "text") {
        if (newLineRegex.test(child.value)) {
          // Split the multi-line text node
          const split = child.value.split(newLineRegex);
          if (split[0]) {
            traversingLine.push({ content: split[0], className });
          }

          // Create new lines for each extra line
          for (let i = 1; i < split.length; i++) {
            traversingLine = [];
            traversedLines.push(traversingLine);
            if (split[i]) {
              traversingLine.push({ content: split[i], className });
            }
          }
        } else {
          // Single-line text node, append to the line
          traversingLine.push({ content: child.value, className });
        }
      } else {
        // Element node, process its children
        traverse(child);
      }
    }
  }

  traverse(ast as never);

  // Return the normalized tokens
  return traversedLines;
}
