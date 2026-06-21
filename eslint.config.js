// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  globalIgnores([
    "dist/*",
    ".expo/**",
    "node_modules/**",
    "jest.setup.js",
    "test/mocks/**",
    "coverage/**",
  ]),
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: ["src/test/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program",
          message:
            "Unit tests must be co-located with source code. Use test/ only for shared setup and mocks.",
        },
      ],
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,tsx}", "**/tests/**/*.{ts,tsx}"],
    rules: {
      "import/first": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
