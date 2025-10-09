import { expect, test, trackStep } from "./common/testBase";

test.describe("Movie detail @agnostic", () => {
  test("open first movie details and go to movie's website", async ({
    homePage,
    movieDetailPage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;
    var title = "";
    await test.step("Navigate to the movies app", async () => {
      await trackStep(
        "Navigate to the movies app",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
        },
        testResult,
      );
    });

    await test.step("Go to detail page of the first movie found", async () => {
      await trackStep(
        "Go to detail page of the first movie found",
        async () => {
          await movieDetailPage.clickFirstMovie();

          await expect(movieDetailPage.page).toHaveURL(/\/movie\?/i);
          await expect(movieDetailPage.backBtn).toBeVisible();
        },
        testResult,
      );
    });

    await test.step("Go to movie's website/IMDB fallback", async () => {
      await trackStep(
        "Go to movie's website/IMDB fallback",
        async () => {
          title = await movieDetailPage.movieTitle.innerText();

          const popupPagePromise = movieDetailPage.page.waitForEvent("popup");
          await movieDetailPage.goToWebsitePopup();
          const popupPage = await popupPagePromise;

          await expect(popupPage).not.toHaveURL(/playwright-movies-app/i);
          const pattern = new RegExp(
            title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i",
          );
          await expect(popupPage).toHaveURL(/^https?:\/\//i);
          await expect(popupPage.locator("body")).toContainText(pattern);
        },
        testResult,
      );
    });
  });
});
