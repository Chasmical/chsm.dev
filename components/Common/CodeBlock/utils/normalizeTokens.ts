import type { RefractorRoot, RefractorElement as RfElem, Text } from "refractor";

export type RefractorElement = RfElem & {
  properties: { className: string[] };
  children: (RefractorElement | Text)[];
};

export type RefractorToken = RefractorElement | Text;

const newLineRegex = /\r?\n|\r/g;

/**
 * Transforms the Refractor's AST into an array of trees of tokens, grouped by line.
 */
export default function normalizeTokens(ast: RefractorRoot): RefractorToken[][] {
  type IntermediateToken =
    | {
        value: string;
        parents: RefractorElement[];
      }
    | {
        value?: never;
        parents?: never;
        tagName: string;
        className: string[];
        children: IntermediateToken[];
      };

  let traversingLine: IntermediateToken[] = [];
  const traversedLines = [traversingLine];
  const parentStack: RefractorElement[] = [];

  // Traverse the entire tree and build a list of nodes with lists of their parents
  function traverse(children: RefractorToken[]) {
    for (const child of children) {
      if (child.type === "text") {
        if (child.value.includes("\n")) {
          // Split the multi-line text node
          const split = child.value.split(newLineRegex);
          if (split[0]) {
            traversingLine.push({ value: split[0], parents: parentStack.slice() });
          }

          // Create new lines for each extra line
          for (let i = 1; i < split.length; i++) {
            traversingLine = [];
            traversedLines.push(traversingLine);
            if (split[i]) {
              traversingLine.push({ value: split[i], parents: parentStack.slice() });
            }
          }
        } else {
          // Single-line text node, append to the line
          traversingLine.push({ value: child.value, parents: parentStack.slice() });
        }
      } else {
        // Element node, add to stack and process its children
        parentStack.push(child);
        traverse(child.children);
        parentStack.pop();
      }
    }
  }

  traverse(ast.children as RefractorToken[]);

  // Function to transform groups of children with same parent into parents with children
  function reduceParents(tokens: IntermediateToken[], from: number, toEx: number, depth = 0) {
    for (let i = from; i < toEx; i++) {
      const token = tokens[i];
      const parent = token.parents?.[depth];
      if (!parent) continue;

      let childrenCount = 1;
      let j = i;
      // Look for the first child's siblings
      while (++j < toEx && tokens[j].parents?.[depth] === parent) childrenCount++;

      // Create a parent and insert it in its children's place
      const newParent: IntermediateToken = {
        tagName: parent.tagName,
        className: parent.properties.className,
        children: undefined!,
      };
      const siblingsAndSelf = tokens.splice(i, childrenCount, newParent);
      newParent.children = siblingsAndSelf;
      toEx -= childrenCount - 1;

      // Combine children groups of the next depth in the new parent
      reduceParents(siblingsAndSelf, 0, siblingsAndSelf.length, depth + 1);
    }
  }

  // Function to turn an intermediate token back into a refractor token
  function convertTokenBack(inter: IntermediateToken): RefractorToken {
    if (inter.value !== undefined) {
      return { type: "text", value: inter.value };
    }
    return {
      type: "element",
      tagName: inter.tagName,
      properties: { className: inter.className },
      children: inter.children.map(convertTokenBack),
    };
  }

  // Combine children groups and convert the tokens
  return traversedLines.map(lineTokens => {
    reduceParents(lineTokens, 0, lineTokens.length);
    return lineTokens.map(convertTokenBack);
  });
}
