import { Children, useMemo } from "react";
import extractDirectives, { DirectiveInfo } from "./extractDirectives";

function stringifyChildren(children: React.ReactNode, results: string[] = []) {
  Children.forEach(children, child => {
    const elem = child as React.ReactElement<React.PropsWithChildren>;
    if (elem?.props?.children != null) {
      stringifyChildren(elem.props.children, results);
    } else {
      results.push(...("" + (child || "")).split("\n"));
    }
  });
  if (!results.at(-1)) results.pop();
  return results;
}

/**
 * Transforms a node into a string of code, and extracts line-highlighting directives from it.
 */
export default function useCodeProcessor(children: React.ReactNode): [code: string, directives: DirectiveInfo[]] {
  return useMemo(() => {
    const lines = stringifyChildren(children);
    const directives = extractDirectives(lines);

    return [lines.join("\n"), directives];
  }, [children]);
}
