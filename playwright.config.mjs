import { defineConfig, devices } from "@playwright/test";
const base = process.env.BASE_PATH || "";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:3100${base}/`,
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
        (process.env.CI ? undefined : "/usr/bin/chromium"),
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve-export.mjs",
    url: `http://127.0.0.1:3100${base}/`,
    reuseExistingServer: false,
    env: { PORT: "3100", BASE_PATH: base },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
});
