import type { BundledLanguage as ShikiBundledLanguage } from "shiki";

const languageIconAliasesConst = [
  // Shiki, Seti, ...aliases
  ["ini", "config"],
  ["csharp", "c-sharp", "cs", "dotnet"],
  ["fsharp", "f-sharp", "fs"],
  ["c", "c", "h"],
  ["javascript", "javascript", "js"],
  ["typescript", "typescript", "ts"],
  ["xml", "xml", "csproj", "props", "targets"],
  ["html", "html"],
  ["html", "svg"], // Custom purplish icon (see public/ folder)
  ["yaml", "yml"],
  ["markdown", "markdown", "md"],
  ["mdx", "markdown"],
  [undefined, "git", "gitignore", "gitattributes"],
  ["shellscript", "shell", "bash", "sh", "zsh"],
  ["powershell", "powershell", "ps", "ps1"],
  ["python", "python", "py"],
  [undefined, "editorconfig"],
  ["cpp", "cpp", "c++"],
  ["css", "css"],
  ["scss", "sass"],
  ["csv", "csv"],
  ["docker", "docker", "dockerfile"],
  [undefined, "eslint"],
  ["go", "go2"], // Prefer "GO" logo over Gopher mascot
  [undefined, "hex"],
  ["jsonc", "json"], // Prefer JSON with comments
  ["jsonc", "tsconfig"],
  ["kotlin", "kotlin", "kt", "kts"],
  ["less", "less"],
  [undefined, "license"],
  ["lua", "lua"],
  ["make", "makefile"],
  ["php", "php"],
  ["jsx", "react"],
  ["tsx", "react"],
  ["rust", "rust", "rs"],
  ["java", "java"],
  ["latex", "tex", "katex"],
  // [undefined, "default"], // Custom light-gray icon (see public/ folder)
] as const;

export type ShikiLanguage = Exclude<(typeof languageIconAliasesConst)[number][0], undefined>;
export type SetiIcon = Exclude<(typeof languageIconAliasesConst)[number][1], undefined>;
export type LanguageOrIconAlias = Exclude<(typeof languageIconAliasesConst)[number][number], undefined>;

type LanguageIconAliases = [shiki: ShikiLanguage | undefined, seti: SetiIcon, ...aliases: string[]];
const languageIconAliases = languageIconAliasesConst as readonly Readonly<LanguageIconAliases>[];

if (process.env.NODE_ENV === "development") {
  // Make sure that ShikiLanguage only contains supported languages
  const _: ShikiBundledLanguage = languageIconAliases[0][0]!;
}

export function findShikiLanguage(name: string | undefined) {
  if (name) return languageIconAliases.find(aliases => aliases.includes(name))?.[0] as ShikiLanguage | undefined;
}
export function findSetiIcon(name: string | undefined) {
  if (name) return languageIconAliases.find(aliases => aliases.includes(name))?.[1] as SetiIcon | undefined;
}
