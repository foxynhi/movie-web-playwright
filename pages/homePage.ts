import type { Locator, Page } from "@playwright/test";
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
  readonly createListMenu;
  readonly myListsMenu;

  constructor(page: Page) {
    super(page);
    this.loginButton = page.getByRole("button", { name: "Log In" });
    this.userProfileButton = page.getByRole("button", { name: "User Profile" });
    this.pageHeading = page.getByRole("heading", { level: 1 });
    this.title = page.getByRole("heading", { name: /movies|film|playwright/i });
    this.grid = page.getByRole("list", { name: "movies" });
    this.logoutButton = page.getByRole("button", { name: "Logout" });
    this.searchButton = page.getByRole("search");
    this.searchInput = page.getByRole("textbox", { name: "Search Input" });
    this.searchSubmit = page.getByRole("button", {
      name: "Search for a movie",
    });
    this.seachNotFound = page.getByRole("heading", { name: "Sorry!" });
    this.createListMenu = page.getByRole("link", { name: "Create New List" });
    this.myListsMenu = page.getByRole("link", { name: "My Lists" });
  }

  async goTo(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  }

  async goToCreateListPage(): Promise<void> {
    await this.waitForElement(this.userProfileButton);
    await this.userProfileButton.hover();
    await this.waitForElement(this.createListMenu);
    await this.click(this.createListMenu);
  }

  async goToMyListPage(): Promise<void> {
    await this.waitForElement(this.userProfileButton);
    await this.userProfileButton.hover();
    await this.waitForElement(this.myListsMenu);
    await this.click(this.myListsMenu);
  }

  async clickLogOut(): Promise<void> {
    await this.waitForElement(this.userProfileButton);
    await this.userProfileButton.hover();
    await this.waitForElement(this.logoutButton);
    await this.click(this.logoutButton);
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
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  movieCards(title: string): Locator {
    const pattern = new RegExp(`\\b${this.escapeRegExp(title)}\\b`, "i");
    const scope = this.grid ?? this.page;
    return scope.getByRole("link", { name: pattern });
  }

  movieCard(title?: string): Locator {
    if (!title) {
      const scope = this.grid ?? this.page;
      return scope.getByRole("link").first();
    }
    return this.movieCards(title).first();
  }

  async movieCardCount(title: string): Promise<number> {
    return await this.movieCards(title).count();
  }
}
