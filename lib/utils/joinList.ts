import plural, { isPlural } from "@lib/utils/plural";

interface JoinConfig<T, J, R = T> {
  prefix?: R | J | ((plural: 0 | 1, count: number) => R | J);
  suffix?: R | J | ((plural: 0 | 1, count: number) => R | J);
  map?: (item: T, index: number, array: T[]) => R;
  join: ((left: R, right: R) => J) | J;
}

export default function joinList<T, J, R = T>(
  list: T[],
  { map, join, prefix, suffix }: JoinConfig<T, J, R>,
): (R | J)[] {
  const results: (R | J)[] = [];
  let prev: R | undefined;
  const length = list.length;

  const prefixFunc = coerceAffix<R>(prefix);
  if (prefixFunc) results.push(prefixFunc(length));

  const joinFunc = typeof join === "function" ? (join as (left: R, right: R) => J) : () => join;

  for (let i = 0; i < length; i++) {
    const cur = map ? map(list[i], i, list) : (list[i] as unknown as R);
    i && results.push(joinFunc(prev!, cur));
    results.push(cur);
    prev = cur;
  }

  const suffixFunc = coerceAffix<R>(suffix);
  if (suffixFunc) results.push(suffixFunc(length));

  return results;
}

function coerceAffix<T>(arg: unknown): ((count: number) => T) | undefined {
  if (arg === undefined) return arg;
  if (typeof arg === "function") return count => arg(isPlural(count), count);
  return count => plural("" + arg, count) as never;
}
