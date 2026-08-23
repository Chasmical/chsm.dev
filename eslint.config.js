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
    ignores: ["supabase/generated-types.ts"],
  },
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
      "react-hooks/use-memo": "off", // doesn't allow using existing functions instead of arrow expressions
      "@next/next/no-img-element": "off", // not a concern at the moment

      "prefer-const": "warn", // prefer const when variable is not reassigned
      "array-callback-return": "warn", // enforce return on Array.map() and etc.
      "no-constant-binary-expression": "warn", // `a + b ?? c` is actually `(a + b) ?? c`

      "@typescript-eslint/no-non-null-assertion": "off", // these are a bit much
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off", // I like || before non-returning functions, like notFound()
      "@typescript-eslint/no-unnecessary-condition": "off", // types aren't always accurate, so ?. sometimes fixes stuff
      "@typescript-eslint/consistent-type-definitions": "off", // sometimes type is more readable
      "@typescript-eslint/prefer-optional-chain": "off", // if (!data || data.name != name)
      "@typescript-eslint/unified-signatures": "off", // separate ones are more maintainable
      "@typescript-eslint/no-unnecessary-type-parameters": "off", // doesn't allow enforcing a function's return type without an "as"
      "@typescript-eslint/consistent-indexed-object-style": "off", // it's nice to have named parameters for indexers

      "@typescript-eslint/no-empty-function": "off", // annoying when writing new code
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
        // projectService: true,
      },
    },
  },
]);
