import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js"

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReactConfig,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    rules: {
      // Custom rules or overrides
      "react/react-in-jsx-scope": "off", // Next.js doesn't require React to be in scope
      "react/prop-types": "off", // Disable prop-types validation
      "@typescript-eslint/no-explicit-any": "off", // Allow any for flexibility
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Warn on unused vars, ignore those starting with _
    },
  },
]
