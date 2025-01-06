import { createHighlighter } from "shiki";
import { createClassTheme } from "./shikiTheme";

export const shiki = await createHighlighter({
  langs: [],
  themes: [createClassTheme()],
});
