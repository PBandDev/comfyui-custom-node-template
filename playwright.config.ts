import { defineConfig, devices } from "@playwright/test";
import { e2eConfig } from "./e2e.config.mjs";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [["line"], ["html", { open: "never" }]],
  workers: 1,
  use: {
    baseURL: e2eConfig.baseUrl,
    trace: "on-first-retry",
    viewport: { width: 1440, height: 960 },
  },
  projects: [
    {
      name: "setup",
      testMatch: /global\.setup\.ts/,
      teardown: "cleanup",
    },
    {
      name: "cleanup",
      testMatch: /global\.teardown\.ts/,
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      testIgnore: [/global\.setup\.ts/, /global\.teardown\.ts/],
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
