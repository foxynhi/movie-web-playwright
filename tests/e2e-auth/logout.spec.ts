import { expect, test, trackStep } from "../common/testBase";

test.describe("Logout (Auth)", () => {
  test("ends the session and returns to guest UI", async ({
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;
    await test.step("Navigate to the movies app", async () => {
      await trackStep(
        "Navigate to the movies app",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);

          await homePage.clickLogOut();

          await expect(homePage.loginButton).toBeVisible();
        },
        testResult,
      );
    });
  });
});
