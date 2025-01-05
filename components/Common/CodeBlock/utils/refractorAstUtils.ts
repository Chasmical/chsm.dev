import type { Text } from "refractor";
import type { RefractorElement as Tag, RefractorToken as Token } from "./normalizeTokens";

export function containsText(node: Token, text: string): boolean {
  if (node.type === "text") return node.value === text;
  return node.children.length === 1 && containsText(node.children[0], text);
}
export function isWhitespace(node: Token) {
  return node?.type === "text" && !node.value.trim();
}

export function matchTag(node: Token, classNames: string | string[], value?: string): node is Tag {
  if (node?.type !== "element" || !classNames.includes(node.properties.className[1])) return false;
  return !value || (node.children.length === 1 && matchText(node.children[0], value));
}
export function matchText(node: Token, value: string): node is Text {
  return node.type === "text" && node.value === value;
}

export function isTagWithText(node: Token, value: string): node is Tag {
  if (node?.type !== "element" || node.children.length !== 1) return false;
  const child = node.children[0];
  return child.type === "text" && child.value === value;
}
export function isTagWithClass(node: Token, className: string | string[]): node is Tag {
  if (node?.type !== "element") return false;
  const classes = node.properties.className;
  return Array.isArray(className) ? classes.some(cl => className.includes(cl)) : classes.includes(className);
}

export function findMatching(children: Token[], from: number, opening: string, closing: string) {
  let depth = 0;

  const visitText = (token: Text) => {
    if (opening.includes(token.value)) depth++;
    else if (closing.includes(token.value) && depth-- == 0) return true;
  };

  for (let i = from; i < children.length; i++) {
    let child = children[i];
    if (child.type === "element" && child.children.length === 1) {
      child = child.children[0];
    }
    if (child.type === "text") {
      if (visitText(child)) return i;
    }
  }
}

export function transformIntoTag(children: Token[], index: number, className: string) {
  createParentWithChildren(children, className, index, index + 1);
}
export function createParentWithChildren(children: Token[], className: string, from: number, to = children.length) {
  const newParent: Tag = {
    type: "element",
    tagName: "span",
    properties: { className: ["token", className] },
    children: undefined!,
  };
  newParent.children = children.splice(from, to - from, newParent) as never;
}
