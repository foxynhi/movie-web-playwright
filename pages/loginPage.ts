import { BasePage } from "./basePage";
import { Page, Locator, expect } from "@playwright/test";

export class LoginPage extends BasePage {
  readonly loginHeading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;

  constructor(page: Page) {
    super(page);

    // Locators using user-centric approach
    this.loginHeading = page.getByRole("heading", {
      name: "Login to the Playwright Stage",
    });
    this.emailInput = page.getByRole("textbox", { name: "Email address" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginSubmitButton = page.getByRole("button", { name: "Login" });
  }

  /**
   * Wait for login form to load
   */
  async waitForLoginForm(): Promise<void> {
    await this.waitForElement(this.loginHeading);
  }

  /**
   * Fill email field
   * @param {string} email - Email address
   */
  async fillEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  /**
   * Fill password field
   * @param {string} password - Password
   */
  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click login submit button
   */
  async clickLoginSubmit(): Promise<void> {
    await this.click(this.loginSubmitButton);
  }

  /**
   * Complete login flow
   * @param {string} email - Email address
   * @param {string} password - Password
   */
  async login(email: string, password: string): Promise<void> {
    await this.waitForLoginForm();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginSubmit();
  }

  /**
   * Verify login form is displayed
   * @returns {Promise<boolean>}
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.isVisible(this.loginHeading);
  }
}
