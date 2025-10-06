import { expect, test, trackStep } from "./testBase";

test.describe("Smoke @smoke", () => {
  test("home page renders grid/list of movies", async ({
    homePage,
    reportGenerator,
    testCredentials,
  }) => {
    await trackStep(
      "Verify home page renders grid/list of movies correctly",
      async () => {
        await homePage.goto(testCredentials.baseUrl);
        await expect(homePage.title).toBeVisible();
        await expect(homePage.grid).toBeVisible();
      },
      reportGenerator.testResult,
    );
  });
});
