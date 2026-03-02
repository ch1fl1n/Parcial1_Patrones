import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/out/**",
      "**/public/**",
      "**/*.min.js",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  // Treat .js files as ES modules (Next.js uses ESM). Previously this forced script
  // sourceType which caused parsing errors for `import`/`export` syntax.
  { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
  pluginReact.configs.flat.recommended,
  // Project-specific adjustments: detect React version and relax rules that
  // are incompatible with modern React (automatic JSX runtime) or with our
  // codebase which doesn't use PropTypes everywhere.
  {
    rules: {
      // New JSX transform doesn't require React in scope
      "react/react-in-jsx-scope": "off",
      // We don't enforce prop-types in this codebase (using TypeScript or implicit checks)
      "react/prop-types": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
]);
