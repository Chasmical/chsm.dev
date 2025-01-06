import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { createClassTheme } from "./shikiTheme";

export type { ThemedToken } from "shiki/core";

export const shikiHighlighter = await createHighlighterCore({
  langs: [],
  themes: [createClassTheme()],
  engine: createOnigurumaEngine(import("shiki/wasm")),
});
