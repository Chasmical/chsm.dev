import { Children } from "react";

export default function stringifyChildren(children: React.ReactNode, results: string[] = []) {
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
