/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const prettierConfig = {
  printWidth: 120,
  useTabs: false,
  tabWidth: 2,
  trailingComma: "all",
  arrowParens: "avoid",
  endOfLine: "lf",

  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: { parser: "astro" },
    },
  ],
};

export default prettierConfig;
