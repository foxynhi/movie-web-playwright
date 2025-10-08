import { expect, test, trackStep } from "../common/testBase";

test.describe("Smoke @smoke", () => {
  test("home page renders grid/list of movies", async ({
    homePage,
    reportGenerator,
    testCredentials,
  }) => {
    await trackStep(
      "Verify home page renders grid/list of movies correctly",
      async () => {
        await homePage.goTo(testCredentials.baseUrl);
        await expect(homePage.title).toBeVisible();
        await expect(homePage.grid).toBeVisible();
      },
      reportGenerator.testResult,
    );
  });
  
  test("verify login form displays correctly", async ({
    homePage,
    loginPage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;

    await test.step("Navigate to the movies app", async () => {
      await trackStep(
        "Navigate to the movies app",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
        },
        testResult,
      );
    });

    await test.step("Click Log In button", async () => {
      await trackStep(
        "Click Log In button",
        async () => {
          await homePage.clickLogin();
        },
        testResult,
      );
    });

    await test.step("Verify login form is visible", async () => {
      await trackStep(
        "Verify login form is visible",
        async () => {
          const isVisible = await loginPage.isLoginFormVisible();
          expect(isVisible).toBeTruthy();
          console.log("✓ Login form is displayed correctly");
        },
        testResult,
      );
    });
  });
});
