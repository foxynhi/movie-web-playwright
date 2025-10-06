import { expect, test, trackStep } from "../testBase";

test.describe("Logout", () => {
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
          await homePage.navigateTo(testCredentials.baseUrl);
          await homePage.userProfileButton.hover();
          await expect(homePage.logoutButton).toBeVisible();
          await homePage.logoutButton.click();
          await expect(homePage.loginButton).toBeVisible();
        },
        testResult,
      );
    });

  });
});
