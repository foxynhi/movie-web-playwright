import type { Page } from "@playwright/test";
import { HomePage } from "./homePage";

export class MovieDetailPage extends HomePage {
  readonly movieTitle;
  readonly websiteBtn;
  readonly websiteLink;
  readonly IMDBBtn;
  readonly IMDBLink;
  readonly backBtn;

  constructor(page: Page) {
    super(page);
    this.movieTitle = page.getByRole("heading", { level: 1 });
    this.websiteBtn = page.getByRole("button", { name: "Website" });
    this.websiteLink = this.websiteBtn.getAttribute("href");
    this.IMDBBtn = page.getByRole("button", { name: "IMDB" });
    this.IMDBLink = this.IMDBBtn.getAttribute("href");
    this.backBtn = page.getByRole("button", { name: "Back" });
  }
  async clickFirstMovie(): Promise<void> {
    await this.click(this.movieCard());
  }
  async goToWebsitePopup(): Promise<void> {
    await this.click(this.websiteBtn);
  }
  async goToIMDBPopup(): Promise<void> {
    await this.click(this.IMDBBtn);
  }
}
