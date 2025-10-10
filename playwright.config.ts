import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 6 : undefined,
  maxFailures: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [
      "html",
      {
        outputFolder: "./TestResults/playwright-report",
        open: process.env.CI ? "never" : "always",
      },
    ],
    ["json", { outputFile: "TestResults/test-results.json" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,
    serviceWorkers: "block",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    timezoneId: "UTC",
    locale: "en-US",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "guest-chromium",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@auth/i,
    },
    {
      name: "guest-firefox",
      use: { ...devices["Desktop Firefox"] },
      grepInvert: /@auth/i,
    },
    {
      name: "guest-webkit",
      use: { ...devices["Desktop Safari"] },
      grepInvert: /@auth/i,
    },
    {
      name: 'guest-mobile-chromium',
      use: { ...devices['Pixel 5'] },
      grepInvert: /@auth/i,
    },
    {
      name: 'guest-mobile-safari',
      use: { ...devices['iPhone 12'] },
      grepInvert: /@auth/i,
    },
    {
      name: 'guest-google-chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      grepInvert: /@auth/i,
    },
    {
      name: 'guest-microsoft-edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      grepInvert: /@auth/i,
    },

    {
      name: "auth-chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "fixtures/storageState.auth.json",
      },
      grepInvert: /@guest/i,
    },
    {
      name: "auth-firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "fixtures/storageState.auth.json",
      },
      grepInvert: /@guest/i,
    },
    {
      name: "auth-webkit",
      use: { 
        ...devices["Desktop Safari"],
        storageState: "fixtures/storageState.auth.json", 
      },
      grepInvert: /@guest/i,
    },
    {
      name: "auth-mobile-chromium",
      use: { 
        ...devices["Pixel 5"],
        storageState: "fixtures/storageState.auth.json", 
      },
      grepInvert: /@guest/i,
    },
    {
      name: "auth-mobile-safari",
      use: { 
        ...devices["iPhone 12"],
        storageState: "fixtures/storageState.auth.json", 
      },
      grepInvert: /@guest/i,
    },
    {
      name: "auth-google-chrome",
      use: { 
        ...devices["Desktop Chrome"],
        channel: 'chrome',
        storageState: "fixtures/storageState.auth.json", 
      },
      grepInvert: /@guest/i,
    },
    {
      name: "auth-microsoft-edge",
      use: { 
        ...devices["Desktop Edge"],
        channel: 'msedge',
        storageState: "fixtures/storageState.auth.json", 
      },
      grepInvert: /@guest/i,
    },
  ],
  globalSetup: require.resolve("./utils/globalSetup"),
});
