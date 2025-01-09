export interface Lazy<T> {
  current?: T;
  import: () => Promise<T>;
}

export default function lazy<T>(factory: () => Promise<T>): Lazy<T> {
  let promise: Promise<T> | undefined;

  const loader: Lazy<T> = {
    import: async () => (loader.current ??= await (promise ??= factory())),
  };

  return loader;
}
