import { Children } from "react";

export default function stringifyChildren(children: React.ReactNode, results: string[] = []) {
  Children.forEach(children, child => {
    const elem = child as React.ReactElement<React.PropsWithChildren>;
    if (elem?.props?.children != null) {
      stringifyChildren(elem.props.children, results);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      results.push(...("" + (child || "")).split(/\r?\n|\r/g));
    }
  });
  if (!results.at(-1)) results.pop();
  return results;
}
