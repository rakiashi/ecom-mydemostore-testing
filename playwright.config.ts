import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment-specific .env file
const envFile =
  process.env.ENV === "integration" ? ".env.integration" : ".env.develop";
dotenv.config({ path: path.resolve(__dirname, envFile) });

// Supported platform browsers
type PlatformBrowserName =
  | "desktop-chromium"
  | "desktop-firefox"
  | "desktop-webkit"
  | "mobile-android-chrome"
  | "mobile-ios-safari";

// Read env variables safely
const platformBrowser: PlatformBrowserName =
  (process.env.PLATFORM_BROWSER_NAME as PlatformBrowserName) ||
  "desktop-chromium";

const headless = process.env.HEADLESS?.toLowerCase() === "true" || false;
const workerCount = Math.max(1, parseInt(process.env.WORKER_COUNT || "4", 10));
const timeout = parseInt(process.env.TIMEOUT || "30000", 10);

// Map browser name to Playwright device config
function getDeviceConfig(name: PlatformBrowserName) {
  switch (name) {
    case "desktop-chromium":
      return devices["Desktop Chrome"];
    case "desktop-firefox":
      return devices["Desktop Firefox"];
    case "desktop-webkit":
      return devices["Desktop Safari"];
    case "mobile-android-chrome":
      return devices["Pixel 5"];
    case "mobile-ios-safari":
      return devices["iPhone 12"];
    default:
      throw new Error(`Unsupported browser: ${name}`);
  }
}

export default defineConfig({
  testDir: "./ui-tests/tests",
  snapshotDir: path.join(__dirname, "snapshots"),
  fullyParallel: false,
  retries: 1,
  reporter: [
    ["list"],
    [
      "monocart-reporter",
      {
        name: "Ecom Mydemostore Test Report",
        outputFile: "./test-results/report.html",
      },
    ],
    ["html", { open: "never" }],
  ],
  timeout,
  workers: workerCount,
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless,
  },
  projects: [
    {
      name: platformBrowser,
      use: {
        ...getDeviceConfig(platformBrowser),
      },
    },
  ],
});
