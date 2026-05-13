/**
 * @type {import('eslint').Linter.Config<import('eslint/rules/index').ESLintRules>}
 */
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import prettierConfig from "eslint-plugin-prettier/recommended";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...nextCoreWebVitals, // react, react-hooks
  prettierConfig,
  {
    plugins: {
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      "prettier/prettier": "warn",

      "@typescript-eslint/no-unused-vars": "off", // handled by "unused-imports" plugin
      "unused-imports/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "unused-imports/no-unused-imports": "warn",

      "react-hooks/exhaustive-deps": "off", // the amount of extra dependencies is excessive

      "prefer-const": "warn", // prefer const when variable is not reassigned
      "array-callback-return": "warn", // enforce return on Array.map() and etc.
      "no-constant-binary-expression": "warn", // a + b ?? c

      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/method-signature-style": ["warn", "property"],
      "@typescript-eslint/array-type": "warn", // prefer T[] over Array<T>
      "@typescript-eslint/no-empty-object-type": ["warn", { allowInterfaces: "with-single-extends" }],
      // interfaces allow to reduce huge mapped types to just an interface name in IDE tooltips
      "@typescript-eslint/no-unused-expressions": ["warn", { allowShortCircuit: true, allowTernary: true }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-namespace": ["warn", { allowDeclarations: true }],
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
  },
]);
