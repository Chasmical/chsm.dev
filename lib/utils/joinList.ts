import plural, { isPlural } from "@lib/utils/plural";

type Pluralize<T> = (plural: boolean, count: number) => T;

interface JoinConfig<Item, Joiner, Mapped = Item> {
  prefix?: Mapped | Joiner | Pluralize<Mapped | Joiner>;
  suffix?: Mapped | Joiner | Pluralize<Mapped | Joiner>;
  map?: (item: Item, index: number, array: Item[]) => Mapped;
  join: Joiner | ((left: Mapped, right: Mapped) => Joiner);
}

export default function joinList<Item, Joiner, Mapped = Item>(
  list: Item[],
  { map, join, prefix, suffix }: JoinConfig<Item, Joiner, Mapped>,
): (Mapped | Joiner | string)[] {
  const results: (Mapped | Joiner | string)[] = [];
  let prev: Mapped | undefined;
  const length = list.length;

  prefix && results.push(coerceAffix(prefix, length));

  const joinFunc = typeof join === "function" ? (join as (left: Mapped, right: Mapped) => Joiner) : () => join;

  for (let i = 0; i < length; i++) {
    const cur = map ? map(list[i], i, list) : (list[i] as unknown as Mapped);
    i && results.push(joinFunc(prev!, cur));
    results.push(cur);
    prev = cur;
  }

  suffix && results.push(coerceAffix(suffix, length));

  return results;
}

function coerceAffix<T>(arg: T | Pluralize<T>, count: number): T | string {
  if (typeof arg === "function") return (arg as Pluralize<T>)(isPlural(count), count);
  return plural("" + arg, count);
}
