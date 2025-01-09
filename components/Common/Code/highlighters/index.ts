/* eslint-disable @typescript-eslint/method-signature-style */
import lazy, { type Lazy } from "@lib/utils/lazy";
import type { ShikiLanguage, ShikiToken } from "./shiki/core";
import type { PrismLanguage, PrismToken } from "./prism/core";
import type { HljsLanguage, HljsToken } from "./hljs/core";

export interface Highlighter<Lang extends string = string, Token = unknown> {
  name: string;
  highlighter: unknown;
  importLang(lang: string | undefined): Promise<Lang | undefined>;
  tokenize(code: string, lang: Lang): Token[][];
  renderToken(token: Token, key: number): React.ReactNode;
}

export type LazyHighlighter<Lang extends string = string, Token = unknown> = Lazy<Highlighter<Lang, Token>>;

export type ShikiHighlighter = Highlighter<ShikiLanguage, ShikiToken>;
export type PrismHighlighter = Highlighter<PrismLanguage, PrismToken>;
export type HljsHighlighter = Highlighter<HljsLanguage, HljsToken>;

// Define loaders for the available highlighters
export const shiki: Lazy<ShikiHighlighter> = lazy(() => import("./shiki/core"));
export const prism: Lazy<PrismHighlighter> = lazy(() => import("./prism/core"));
export const hljs: Lazy<HljsHighlighter> = lazy(() => import("./hljs/core"));

export const highlighters = { shiki, prism, hljs };
export type HighlighterName = keyof typeof highlighters;
