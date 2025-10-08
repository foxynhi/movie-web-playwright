import { BasePage } from "./basePage";
import type { Page, Locator } from "@playwright/test";

export class LoginPage extends BasePage {
  readonly loginHeading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.loginHeading = page.getByRole("heading", {
      name: "Login to the Playwright Stage",
    });
    this.emailInput = page.getByRole("textbox", { name: "Email address" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginSubmitButton = page.getByRole("button", { name: "Login" });
  }

  async waitForLoginForm(): Promise<void> {
    await this.waitForElement(this.loginHeading);
  }

  async login(email: string, password: string): Promise<void> {
    await this.waitForElement(this.loginHeading);
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginSubmitButton);
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.isVisible(this.loginHeading);
  }
}
