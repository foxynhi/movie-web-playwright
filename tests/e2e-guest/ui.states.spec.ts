import { expect, test, trackStep } from "../testBase";

test.describe("UI states", () => {
  // test.beforeEach(async ({ homePage }) => {
  //   await homePage.page.unrouteAll({ behavior: 'ignoreErrors' });
  // });

  // test.afterEach(async ({ homePage }) => {
  //   await homePage.page.unrouteAll({ behavior: 'ignoreErrors' });
  // });

  test("Mock empty response", async ({
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;
    await test.step("Navigate to /search route and verify empty response", async () => {
      await trackStep(
        "Navigate to /search route and verify empty response",
        async () => {
          await homePage.page.route(
            /\/search/i,
            async (route) =>
              await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ results: [], total_results: 0 }),
              }),
          );

          await homePage.goTo(testCredentials.baseUrl);
          await homePage.fillSearchInput("test");

          await expect(homePage.page.getByText("total_results")).toBeVisible();
        },
        testResult,
      );
    });
  });

  test("Mock error response", async ({
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;
    await test.step("Navigate to /search route and verify error response", async () => {
      await trackStep(
        "Navigate to /search route and verify error response",
        async () => {
          await homePage.goTo(testCredentials.baseUrl + "/error");
          await expect(homePage.page.getByText("error")).toBeVisible();
        },
        testResult,
      );
    });
  });

  test("Mock loading state", async ({
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;
    await test.step("Navigate to /search route and verify loading state", async () => {
      await trackStep(
        "Navigate to /search route and verify loading state",
        async () => {
          await homePage.goTo(testCredentials.baseUrl + "/search");
          const loading = homePage.page
            .getByTestId(/loading|skeleton/i)
            .or(homePage.page.locator("css=.loading"));

          await expect(loading).toBeVisible();
        },
        testResult,
      );
    });
  });
});
