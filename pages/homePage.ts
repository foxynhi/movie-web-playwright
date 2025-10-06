import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
  readonly loginButton;
  readonly userProfileButton;
  readonly pageHeading;
  readonly title;
  readonly grid;
  readonly logoutButton;
  readonly searchButton;
  readonly searchInput;
  readonly searchSubmit;
  readonly seachNotFound;

  constructor(page: Page) {
    super(page);
    this.loginButton = page.getByRole("button", { name: "Log In" });
    this.userProfileButton = page.getByRole("button", { name: "User Profile" });
    this.pageHeading = page.getByRole("heading", { level: 1 });
    this.title = page.getByRole("heading", { name: /movies|film|playwright/i });
    this.grid = page.getByRole("list", { name: "movies" });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.searchButton = page.getByRole('search');
    this.searchInput = page.getByRole('textbox', { name: 'Search Input' });
    this.searchSubmit = page.getByRole('button', { name: 'Search for a movie' });
    this.seachNotFound = page.getByRole('heading', { name: 'Sorry!' });  
  }

  async goto(baseUrl: string): Promise<void> {
    await this.navigateTo(baseUrl);
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.userProfileButton);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  async verifyLoggedIn(): Promise<void> {
    await this.waitForElement(this.userProfileButton);
  }

  async getCategoryHeading(): Promise<string | null> {
    return await this.pageHeading.textContent();
  }

  async fillSearchInput(title: string): Promise<void> {
    await this.click(this.searchButton);
    await this.fill(this.searchInput, title);
    await this.click(this.searchSubmit);
  }

  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  movieCards(title: string): Locator {
    const pattern = new RegExp(`\\b${this.escapeRegExp(title)}\\b`, 'i');
    const scope = this.grid ?? this.page;
    return scope.getByRole('link', { name: pattern });
  }

  movieCard(title: string): Locator {
    return this.movieCards(title).first();
  }

  async movieCardCount(title: string): Promise<number> {
    return this.movieCards(title).count();
  }
}
