import type { RefractorRoot, RefractorToken } from "./normalizeTokens";
import { visit } from "unist-util-visit";
import {
  findMatching,
  isTagWithClass,
  isTagWithText,
  isWhitespace,
  transformIntoTag,
  matchTag,
} from "./refractorAstUtils";

export function typescriptAstFixes(ast: RefractorRoot) {
  visit(ast, "element", (node, index_, parent_) => {
    const index = index_!;
    const parent = parent_!;

    if (node.properties.className?.includes("class-name")) {
      // Highlight nested types and process types in generics
      let i = index + 1;

      if (isTagWithText(parent.children[i++], ".")) {
        if (parent.children[i++]?.type === "text") {
          transformIntoTag(parent.children, i, "class-name");
        }
        if (isTagWithText(parent.children[i++], "<")) {
          const typeBoundaryEnd = findMatching(parent.children, i, "<", ">");
          transformKeywords(parent.children, i, typeBoundaryEnd);
        }
      }
    }

    if (matchTag(node, "operator", ":")) {
      // Process types properly for variables and parameters
      const i = index + 1;
      const typeBoundaryEnd = findMatching(parent.children, i, "<{(", ">}),;=");
      transformKeywords(parent.children, i, typeBoundaryEnd);
    }
    if (matchTag(node, "keyword", "as")) {
      // Process types properly in `value as (T | S)`
      const i = index + 1;
      const typeBoundaryEnd = findMatching(parent.children, i, "<{(", ">}),;");
      transformKeywords(parent.children, i, typeBoundaryEnd);
    }
    if (matchTag(node, "keyword", "type")) {
      // Process types properly in `type A = B`
      let i = index + 1;
      if (
        isWhitespace(parent.children[i++]) &&
        isTagWithClass(parent.children[i++], "class-name") &&
        isWhitespace(parent.children[i++]) &&
        matchTag(parent.children[i++], "operator", "=")
      ) {
        const typeBoundaryEnd = findMatching(parent.children, i, "<{(", ">});");
        transformKeywords(parent.children, i, typeBoundaryEnd);
      }
    }
  });
}

function transformKeywords(children: RefractorToken[], startIndex = 0, endIndex = children.length) {
  for (let i = startIndex; i < endIndex; i++) {
    const child = children[i];
    // Replace keyword/builtin/constant/boolean with class-name
    if (isTagWithClass(child, ["keyword", "builtin", "constant", "boolean"])) {
      child.properties.className[1] = "class-name";
    }
    // Turn unstyled text tokens into tags with class-name
    if (child.type === "text" && child.value.trim()) {
      transformIntoTag(children, i, "class-name");
    }
  }
}
