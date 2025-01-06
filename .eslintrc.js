/**
 * @type {import('eslint').Linter.Config<import('eslint/rules/index').ESLintRules>}
 */
module.exports = {
  extends: ["next/core-web-vitals", "next/typescript", "plugin:prettier/recommended"],
  plugins: ["unused-imports"],
  rules: {
    "prettier/prettier": "warn",

    "array-callback-return": "warn", // enforce return on Array.map() and etc.
    "no-constant-binary-expression": "warn", // a + b ?? c

    "@typescript-eslint/no-unused-vars": "off", // handled by "unused-imports" plugin
    "unused-imports/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "unused-imports/no-unused-imports": "warn",

    "no-empty": "off", // annoying when writing new code
    "prefer-const": "warn", // prefer const when variable is not reassigned
    "react-hooks/exhaustive-deps": "off", // the amount of extra dependencies is excessive
    "@next/next/no-img-element": "off", // not useful at the moment
    "@typescript-eslint/method-signature-style": ["warn", "property"],
    "@typescript-eslint/array-type": "warn", // prefer T[] over Array<T>
    "@typescript-eslint/no-empty-object-type": ["warn", { allowInterfaces: "with-single-extends" }],
    // interfaces allow to reduce huge mapped types to just an interface name in IDE tooltips
    "@typescript-eslint/no-unused-expressions": ["warn", { allowShortCircuit: true, allowTernary: true }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-namespace": ["warn", { allowDeclarations: true }],
  },
  // enable linting in /app/api/.private/ directory
  ignorePatterns: ["!/app/api/.private"],
};
