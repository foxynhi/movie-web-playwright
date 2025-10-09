import type { Page } from "@playwright/test";
import { HomePage } from "../../pages/homePage";
import { LoginPage } from "../../pages/loginPage";
import type { TestCredentials } from "../../fixtures/interfaces";

export async function performLogin(
  page: Page,
  credentials: TestCredentials,
): Promise<void> {
  if (!credentials.email || !credentials.password) {
    throw new Error("Missing TEST_EMAIL/TEST_PASSWORD");
  }

  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  await homePage.goTo(credentials.baseUrl);

  const loggedin = await homePage.userProfileButton.count();
  if (loggedin > 0) {
    return;
  }

  const loginCount = await homePage.loginButton.count();
  if (loginCount === 0) {
    throw new Error(
      "performLogin: no Login button found on this app/route. Update selectors or app URL.",
    );
  }

  await homePage.clickLogin();
  await loginPage.waitForLoginForm();
  await loginPage.login(credentials.email, credentials.password);
  await homePage.verifyLoggedIn();

  const hasAuthKey = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    return keys.some((k) => /(zaps.movies.dev)/i.test(k));
  });
  if (!hasAuthKey) {
    throw new Error(
      "performLogin: no auth-like key found in localStorage after login",
    );
  }
}
