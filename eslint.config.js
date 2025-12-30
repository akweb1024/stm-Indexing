import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist/",
      "node_modules/",
      "*.cjs",
      "functions/node_modules/",
      "functions/lib/",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
