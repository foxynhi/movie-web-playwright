import { expect, test, trackStep } from "../common/testBase";

test.describe("Movie List", () => {
  const movieListName: string = "My Favorite Movies";
  const movieListDescription: string = "A list of my all-time favorite movies";
  const movieName: string = "Gunner";
  test("Create a movie list", async ({
    homePage,
    testCredentials,
    movieListPage,
    reportGenerator,
  }) => {
    await test.step("Navigate to authenticated movies app", async () => {
      await trackStep(
        "Navigate to authenticated movies app",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
          expect(await homePage.isUserLoggedIn()).toBeTruthy();
        },
        reportGenerator.testResult,
      );
    });

    await test.step("Go to Create list page", async () => {
      await trackStep(
        "Go to Create list page",
        async () => {
          await homePage.goToCreateListPage();
          await expect(movieListPage.createPageTitle).toBeVisible();
        },
        reportGenerator.testResult,
      );
    });

    await test.step("Fill in movie list form", async () => {
      await trackStep(
        "Fill in movie list form",
        async () => {
          await movieListPage.fillMovieListForm(
            movieListName,
            movieListDescription,
            true,
          );
          await expect(movieListPage.getListPageTitle()).toHaveText(
            movieListName,
          );
        },
        reportGenerator.testResult,
      );
    });

    await test.step("Add movie to list", async () => {
      await trackStep(
        "Add movie to list",
        async () => {
          const preCount = await movieListPage.countItemsInList();
          await movieListPage.addMovieItem(movieName);

          await expect
            .poll(async () => await movieListPage.countItemsInList())
            .not.toEqual(preCount);
          await expect(
            movieListPage.itemsInList.filter({ hasText: movieName }).first(),
          ).toBeVisible();
        },
        reportGenerator.testResult,
      );
    });
  });
});
