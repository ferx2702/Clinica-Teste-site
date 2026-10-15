import { defineConfig } from "@playwright/test";
import config from "./playwright.config";
export default defineConfig({
  ...config,
  testIgnore: [],
  testMatch: "**/*.pages.spec.ts",
  webServer: {
    command: "node scripts/serve-export.mjs",
    url: "http://127.0.0.1:3100/Clinica-Teste-site/",
    reuseExistingServer: false,
    env: { NEXT_PUBLIC_BASE_PATH: "/Clinica-Teste-site", PORT: "3100" },
  },
});
