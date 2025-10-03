import { test as base, TestInfo } from "@playwright/test";
import { HomePage } from "../pages/homePage";
import { LoginPage } from "../pages/loginPage";
import { ReportGenerator } from "../utils/reportGenerator";
import dotenv from "dotenv";
import { ReportGeneratorFixture, TestResult } from "../utils/interfaces";
import { BasePage } from "../pages/basePage";
export { expect } from "@playwright/test";

dotenv.config();

type TestFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  reportGenerator: ReportGeneratorFixture;
  authenticatedPage: void;
  testCredentials: {
    email: string;
    password: string;
    baseUrl: string;
  };
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    console.log(
      "Hello: ",
      process.env.TEST_WORKER_INDEX,
      process.env.TEST_PARALLEL_INDEX,
    );
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  testCredentials: async ({}, use) => {
    await use({
      email: process.env.TEST_EMAIL || "",
      password: process.env.TEST_PASSWORD || "",
      baseUrl: process.env.BASE_URL || "",
    });
  },

  /**
   * Report generator fixture - handles test reporting
   * This runs automatically after each test
   */
  reportGenerator: async ({ page }, use, testInfo: TestInfo) => {
    const reportGenerator = new ReportGenerator();

    const testResult: TestResult = {
      testName: testInfo.title,
      status: undefined,
      duration: 0,
      startTime: Date.now(),
      steps: [],
      browser: page.context().browser()?.browserType()?.name(),
      testFile: testInfo.file,
    };

    await use({ reportGenerator, testResult });

    // After test completion - generate report
    testResult.status = testInfo.status;
    testResult.duration = BasePage.getDuration(testResult.startTime);

    if (testInfo.error) {
      testResult.error = testInfo.error.stack;
    }

    // Generate report
    try {
      const reportPath = reportGenerator.generateReport(testResult);
      console.log(`\n📊 Test report generated: ${reportPath}`);
    } catch (error) {
      console.error("❌ Error generating report:", error);
    }
  },

  /**
   * Auto-login fixture - automatically logs in before test
   * Use this for tests that require authenticated state
   */
  authenticatedPage: async (
    { page, homePage, loginPage, testCredentials },
    use,
  ) => {
    // Navigate to home page
    await homePage.goto(testCredentials.baseUrl);

    // Check if already logged in
    const isLoggedIn = await homePage.isUserLoggedIn();

    if (!isLoggedIn) {
      // Perform login
      await homePage.clickLogin();
      await loginPage.login(testCredentials.email, testCredentials.password);

      // Verify login successful
      await homePage.verifyLoggedIn();
    }

    // Page is now authenticated and ready to use
    await use();
  },
});

export async function trackStep(
  stepName: string,
  stepFunction: () => Promise<void>,
  testResult: TestResult,
): Promise<void> {
  const stepStart = Date.now();

  try {
    await stepFunction();
    const duration = Date.now() - stepStart;
    testResult.steps.push({ step: stepName, duration });
    testResult.status = "passed";
  } catch (error) {
    const duration = Date.now() - stepStart;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    testResult.steps.push({
      step: stepName,
      duration,
    });
    testResult.status = "failed";
    testResult.error = errorMessage;
    throw error;
  }
}
