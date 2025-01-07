export type Loader<T> = { import: () => Promise<T>; current?: T };

function createLoader<T>(factory: () => Promise<T>): Loader<T> {
  let promise: Promise<T> | undefined;

  const loader: Loader<T> = {
    import: async () => (loader.current ??= await (promise ??= factory())),
  };
  return loader;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Highlighter<Token = unknown, Lang = string> {
  name: string;
  importLang: (lang: string | undefined) => Promise<Lang | undefined>;
  tokenize: (code: string, lang: string) => Token[][];
  renderToken: (token: Token, key: number) => React.ReactNode;
}

// Define loaders for the available highlighters

export type HighlighterName = "shiki" | "prism" | "hljs";

export const shiki = createLoader(() => import("./shiki/core"));
export const prism = createLoader(() => import("./prism/core"));
export const hljs = createLoader(() => import("./hljs/core"));

export const highlighters: Record<HighlighterName, Loader<Highlighter>> = {
  shiki: shiki as never,
  prism: prism as never,
  hljs: hljs as never,
};
