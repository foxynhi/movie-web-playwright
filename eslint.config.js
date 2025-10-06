// eslint.config.js
// Flat-config for Playwright + TypeScript (ESLint v9+)
import globals from "globals";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default tseslint.config(
  // 1) Ignore files/folders
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "playwright-report/",
      "test-results/",
      "TestResults/",
      ".eslintcache",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Uses your tsconfig automatically (fast, multi-project friendly)
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.es2024, ...globals.node },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // General TS hygiene
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Avoid lost promises in helpers/page objects
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "no-void": ["warn", { allowAsStatement: true }],
    },
  },
  {
    files: ["tests/**/*.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/*.e2e.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.es2024, ...globals.node, ...globals.browser },
    },
    plugins: { playwright },
    rules: {
      // Core Playwright best-practices (hand-picked flat equivalent)
      "playwright/no-conditional-in-test": "warn",
      "playwright/no-element-handle": "error",
      "playwright/no-force-option": "warn",
      "playwright/no-networkidle": "off", // enable if you want to discourage it
      "playwright/no-page-pause": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/no-wait-for-timeout": "warn",
      "playwright/prefer-locator": "error",
      "playwright/prefer-to-have-length": "warn",
    },
  },
);
