import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

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
  workers: process.env.CI ? 1 : undefined,
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

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'guest-chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: ['**/e2e-auth/**'], },
    { name: 'guest-firefox',  use: { ...devices['Desktop Firefox'] }, testIgnore: ['**/e2e-auth/**'], },
    { name: 'guest-webkit',   use: { ...devices['Desktop Safari'] }, testIgnore: ['**/e2e-auth/**'], },

    // --- AUTH (logged in via storageState) ---
    { name: 'auth-chromium', use: { ...devices['Desktop Chrome'],  storageState: 'fixtures/storageState.auth.json' }, testIgnore: ['**/e2e-guest/**'] },
    { name: 'auth-firefox',  use: { ...devices['Desktop Firefox'], storageState: 'fixtures/storageState.auth.json' }, testIgnore: ['**/e2e-guest/**'] },
    { name: 'auth-webkit',   use: { ...devices['Desktop Safari'],  storageState: 'fixtures/storageState.auth.json' }, testIgnore: ['**/e2e-guest/**'] },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 9'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  globalSetup: require.resolve('./tests/setup/globalSetup'),
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
