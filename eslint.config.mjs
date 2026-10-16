export default [
  {
    ignores: [
      "out/**",
      "node_modules/**",
      ".next/**",
      "test-results/**",
      "docs/**",
    ],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        window: "readonly",
        Element: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly",
        URL: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        CustomEvent: "readonly",
        IntersectionObserver: "readonly",
        AbortController: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
  },
];
