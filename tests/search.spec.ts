import { test, trackStep, expect } from "./common/testBase";

test.describe("Search @agnostic", () => {
  test("search for movies with valid search string", async ({
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;
    const searchText = "war";

    await test.step("Navigate to the movies app", async () => {
      await trackStep(
        "Navigate to the movies app",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
        },
        testResult,
      );
    });
    await test.step("Fill in search input", async () => {
      await trackStep(
        "Fill in search input",
        async () => {
          await homePage.fillSearchInput(searchText);
          await homePage.page.waitForLoadState("networkidle");
        },
        testResult,
      );
    });
    await test.step("Verify search found", async () => {
      await trackStep(
        "Verify search found",
        async () => {
          const count = await homePage.movieCardCount(searchText);
          expect(count).toBeGreaterThan(0);
        },
        testResult,
      );
    });
  });

  test("search with invalid search string", async ({
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;
    const searchText = "afdgsdfger";

    await test.step("Navigate to the movies app", async () => {
      await trackStep(
        "Navigate to the movies app",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
        },
        testResult,
      );
    });
    await test.step("Fill in search input", async () => {
      await trackStep(
        "Fill in search input",
        async () => {
          await homePage.fillSearchInput(searchText);
          await homePage.page.waitForLoadState("networkidle");
        },
        testResult,
      );
    });
    await test.step("Verify search not found", async () => {
      await trackStep(
        "Verify search not found",
        async () => {
          await expect(homePage.seachNotFound).toBeVisible();
        },
        testResult,
      );
    });
  });
});
