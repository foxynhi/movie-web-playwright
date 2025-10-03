import { expect, test, trackStep } from "./testBase";

test.describe("Movies App Login Tests", () => {
  test("Login: login with valid credentials", async ({
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
          await homePage.goto(testCredentials.baseUrl);
        },
        testResult,
      );
    });

    await test.step("Check if already logged in", async () => {
      await trackStep(
        "Check if already logged in",
        async () => {
          const isLoggedIn = await homePage.isUserLoggedIn();
          if (isLoggedIn) {
            console.log("User is already logged in, skipping login steps.");
            return;
          }
        },
        testResult,
      );
    });

    await test.step("Click on login button", async () => {
      await trackStep(
        "Click on login button",
        async () => {
          await homePage.clickLogin();
        },
        testResult,
      );
    });

    await test.step("Fill in login credentials and submit", async () => {
      await trackStep(
        "Fill in login credentials and submit",
        async () => {
          await loginPage.login(
            testCredentials.email,
            testCredentials.password,
          );
        },
        testResult,
      );
    });

    await test.step("Verify successful login", async () => {
      await trackStep(
        "Verify successful login",
        async () => {
          await homePage.verifyLoggedIn();

          const isLoggedIn = await homePage.isUserLoggedIn();
          expect(isLoggedIn).toBeTruthy();

          console.log("✓ Login successful - User Profile button is visible");
        },
        testResult,
      );
    });
  });

  test("Login: verify login form displays correctly @smoke", async ({
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
          await homePage.goto(testCredentials.baseUrl);
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
