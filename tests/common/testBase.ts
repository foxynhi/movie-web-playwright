import type { TestInfo } from "@playwright/test";
import { test as base } from "@playwright/test";
import { HomePage } from "../../pages/homePage";
import { LoginPage } from "../../pages/loginPage";
import { ReportGenerator } from "../../utils/reportGenerator";
import type {
  ReportGeneratorFixture,
  TestResult,
} from "../../fixtures/interfaces";
import { BasePage } from "../../pages/basePage";
import { performLogin } from "./auth";
import { MovieDetailPage } from "../../pages/movieDetailPage";
import { MovieListPage } from "../../pages/movieListPage";
export { expect } from "@playwright/test";

type TestFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  movieDetailPage: MovieDetailPage;
  movieListPage: MovieListPage;
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
      "Worker - Parallel index: ",
      process.env.TEST_WORKER_INDEX,
      process.env.TEST_PARALLEL_INDEX,
    );
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  movieDetailPage: async ({ page }, use) => {
    const movieDetailPage = new MovieDetailPage(page);
    await use(movieDetailPage);
  },

  movieListPage: async ({ page }, use) => {
    const movieListPage = new MovieListPage(page);
    await use(movieListPage);
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
  authenticatedPage: async ({ page, testCredentials }, use) => {
    // Navigate to home page
    await performLogin(page, testCredentials);

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
