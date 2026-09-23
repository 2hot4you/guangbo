import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {baseURL: "http://127.0.0.1:43187", channel: "chrome", trace: "retain-on-failure"},
  webServer: {command: "pnpm dev", port: 43187, reuseExistingServer: false, timeout: 120_000},
  projects: [
    {name: "desktop-chromium", use: {...devices["Desktop Chrome"]}},
    {name: "mobile-chromium", use: {...devices["Pixel 7"]}},
  ],
});
