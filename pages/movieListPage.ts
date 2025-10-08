import type { Locator, Page } from "@playwright/test";
import { HomePage } from "./homePage";

export class MovieListPage extends HomePage {
  readonly createPageTitle;
  readonly listName;
  readonly listDescription;
  readonly publicInput;
  readonly publicYesOption;
  readonly publicNoOption;
  readonly continueBtn;
  readonly addItemInput;
  readonly itemList;
  readonly itemsInList;

  constructor(page: Page) {
    super(page);
    this.createPageTitle = page.getByRole("heading", {
      name: "Create New List",
    });
    this.listName = page.getByRole("textbox", { name: "Name" });
    this.listDescription = page.getByRole("textbox", { name: "Description" });
    this.publicInput = page.getByRole("textbox", { name: "Public List?" });
    this.publicYesOption = page.getByRole("button", { name: "Yes" });
    this.publicNoOption = page.getByRole("button", { name: "No" });
    this.continueBtn = page.getByRole("button", { name: "Continue" });
    this.addItemInput = page.getByRole("textbox", { name: "Add Item" });
    this.itemList = page.getByRole("list", { name: "movies" });
    this.itemsInList = page.getByRole("list", { name: "movies" }).locator("li");
  }

  getListPageTitle(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }

  async fillMovieListForm(
    name: string,
    description: string,
    isPublic: boolean,
  ): Promise<void> {
    await this.listName.fill(name);
    await this.listDescription.fill(description);
    await this.click(this.publicInput);
    if (isPublic) {
      await this.click(this.publicYesOption);
    } else {
      await this.click(this.publicNoOption);
    }
    await this.click(this.continueBtn);
  }

  async goToMovieListByName(name: string): Promise<void> {
    await this.page.getByRole("link", { name: name }).first().click();
  }

  async addMovieItem(title: string): Promise<void> {
    await this.addItemInput.fill(title);
    const movieItem = this.page.getByRole("button").filter({
      hasText: new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    });
    await this.click(movieItem);
  }

  async countItemsInList(): Promise<number> {
    return await this.itemList.locator("li").count();
  }
}
