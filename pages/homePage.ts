import { Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
  readonly loginButton;
  readonly userProfileButton;
  readonly searchInput;
  readonly pageHeading;
  readonly title;
  readonly grid;
  readonly logoutButton;

  constructor(page: Page) {
    super(page);

    // Locators using user-centric approach
    this.loginButton = page.getByRole("button", { name: "Log In" });
    this.userProfileButton = page.getByRole("button", { name: "User Profile" });
    this.searchInput = page.getByPlaceholder("Search for a movie...");
    this.pageHeading = page.getByRole("heading", { level: 1 });
    this.title = page.getByRole("heading", { name: /movies|film|playwright/i });
    this.grid = page.getByRole("list", { name: "movies" });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  /**
   * Navigate to home page
   * @param {string} baseUrl - Base URL from env
   */
  async goto(baseUrl: string): Promise<void> {
    await this.navigateTo(baseUrl);
  }

  /**
   * Check if user is logged in
   * @returns {Promise<boolean>}
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.userProfileButton);
  }

  /**
   * Click login button to open login page
   */
  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Verify user profile button is visible (user is logged in)
   */
  async verifyLoggedIn(): Promise<void> {
    await this.waitForElement(this.userProfileButton);
  }

  /**
   * Search for a movie
   * @param {string} movieName - Movie name to search
   */
  async searchMovie(movieName: string): Promise<void> {
    await this.fill(this.searchInput, movieName);
    await this.page.keyboard.press("Enter");
  }

  /**
   * Get current category heading
   * @returns {Promise<string>}
   */
  async getCategoryHeading(): Promise<string | null> {
    return await this.pageHeading.textContent();
  }
}
