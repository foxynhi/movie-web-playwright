import { expect, test, trackStep } from "./common/testBase";

test.describe("Visual @visual @agnostic", () => {
  test.beforeEach(async ({ homePage, testCredentials, reportGenerator }) => {
    await test.step("Initial load", async () => {
      await trackStep(
        "Initial load",
        async () => {
          try {
            await homePage.goTo(testCredentials.baseUrl);
            await homePage.page.addStyleTag({
              content: `*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}`,
            });
            await homePage.page.evaluate(() => (document as any).fonts?.ready);
          } catch (error) {
            console.error("beforeEach failed:", error);
            throw error;
          }
        },
        reportGenerator.testResult,
      );
    });
  });

  test("home page", async ({ homePage, reportGenerator }) => {
    await test.step("Compare to baseline snapshot", async () => {
      await trackStep(
        "Compare to baseline snapshot",
        async () => {
          if (homePage.page.isClosed()) {
            throw new Error("Page was closed before screenshot");
          }

          await expect(homePage.grid).toBeVisible({ timeout: 10000 });

          await homePage.page.evaluate(() => {
            return Promise.all(
              Array.from(document.images)
                .filter((img) => !img.complete)
                .map(
                  (img) =>
                    new Promise((resolve) => {
                      img.onload = img.onerror = resolve;
                      setTimeout(resolve, 5000);
                    }),
                ),
            );
          });

          await homePage.page.waitForTimeout(1000);

          await expect(homePage.page).toHaveScreenshot("home.png", {
            fullPage: true,
            animations: "disabled",
            timeout: 10_000,
            maxDiffPixels: 500,
            threshold: 0.2,
          });
        },
        reportGenerator.testResult,
      );
    });
  });

  test("movie detail page", async ({
    homePage,
    movieDetailPage,
    reportGenerator,
  }) => {
    await test.step("Compare to baseline snapshot", async () => {
      await trackStep(
        "Compare to baseline snapshot",
        async () => {
          if (homePage.page.isClosed()) {
            throw new Error("Page was closed before screenshot");
          }

          await expect(homePage.grid).toBeVisible();

          await homePage.movieCard().click();
          await expect(movieDetailPage.page).toHaveURL(/\/movie\?/i, {
            timeout: 10000,
          });

          const loadingIndicator = movieDetailPage.page.locator("css=.loading");
          if (await loadingIndicator.isVisible().catch(() => false)) {
            await expect(loadingIndicator).toBeHidden({ timeout: 10000 });
          }

          await expect(movieDetailPage.movieTitle).toBeVisible();
          await expect(movieDetailPage.websiteBtn).toBeVisible();

          await movieDetailPage.page.evaluate(() => {
            return Promise.all(
              Array.from(document.images)
                .filter((img) => !img.complete)
                .map(
                  (img) =>
                    new Promise((resolve) => {
                      img.onload = img.onerror = resolve;
                    }),
                ),
            );
          });

          await movieDetailPage.page.waitForTimeout(2000);

          await expect(movieDetailPage.page).toHaveScreenshot(
            "movieDetail.png",
            {
              fullPage: true,
              animations: "disabled",
              timeout: 10_000,
              maxDiffPixels: 500,
              threshold: 0.2,
            },
          );
        },
        reportGenerator.testResult,
      );
    });
  });
});
