import type { BundledLanguage as ShikiBundledLanguage } from "shiki";

// [shiki grammar, seti icon, ...aliases][]
const languageIconAliasesConst = [
  // Some languages use their supersets' grammars, to minimize bundle size

  // Webdev languages
  ["tsx", "react", "jsx"],
  ["tsx", "typescript", "ts"], // Prefer TSX over TS/JS/JSX
  ["tsx", "javascript", "js"],
  ["html", "html"],
  ["html", "svg"], // Custom purplish icon (see public/ folder)
  ["scss", "sass"],
  ["scss", "css"], // Prefer SCSS over CSS

  // Other languages
  ["csharp", "c-sharp", "cs", "dotnet"],
  ["fsharp", "f-sharp", "fs"],
  ["cpp", "cpp", "c++"],
  ["cpp", "c", "h"], // Prefer C++ over C
  ["rust", "rust", "rs"],
  ["python", "python", "py"],

  // Data formats
  ["ini", "config"],
  ["xml", "xml", "csproj", "props", "targets"],
  ["jsonc", "json"], // Prefer JSON with comments
  ["yaml", "yml"],
  ["csv", "csv"],

  // Other
  ["markdown", "markdown", "md"],
  ["mdx", "markdown"],
  ["latex", "tex", "katex"],
  [undefined, "hex"],

  // Configuration files
  [undefined, "git", "gitignore", "gitattributes"],
  [undefined, "editorconfig"],
  [undefined, "eslint"],
  [undefined, "license"],
  ["shellscript", "shell", "bash", "sh", "zsh"],
  ["powershell", "powershell", "ps", "ps1"],
  ["docker", "docker", "dockerfile"],
  ["jsonc", "tsconfig"],
  ["make", "makefile"],

  // [undefined, "default"], // Custom light-gray icon (see public/ folder)
] as const;

export type ShikiLanguage = Exclude<(typeof languageIconAliasesConst)[number][0], undefined>;
export type SetiIcon = Exclude<(typeof languageIconAliasesConst)[number][1], undefined>;
export type LanguageOrIconAlias = Exclude<(typeof languageIconAliasesConst)[number][number], undefined>;

// Ensure that the language names map to existing Shiki language names
type _Check<T extends ShikiBundledLanguage = ShikiLanguage> = T;

type LanguageIconAliases = [shiki: ShikiLanguage | undefined, seti: SetiIcon, ...aliases: string[]];
const languageIconAliases = languageIconAliasesConst as readonly Readonly<LanguageIconAliases>[];

export function findShikiLanguage(name: string | undefined) {
  if (name) return languageIconAliases.find(aliases => aliases.includes(name))?.[0] as ShikiLanguage | undefined;
}
export function findSetiIcon(name: string | undefined) {
  if (name) return languageIconAliases.find(aliases => aliases.includes(name))?.[1] as SetiIcon | undefined;
}
