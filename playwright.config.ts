import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Nuxt dev-server hydration becomes nondeterministic under multi-page worker
  // pressure, which can drop early clicks and destabilize full-page baselines.
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  expect: { toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0.015 } },
  use: {
    baseURL: "http://127.0.0.1:3200",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 3200",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
