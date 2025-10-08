import type { Locator, Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   * @param {string} url - The URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Wait for an element to be visible
   * @param {import('@playwright/test').Locator} locator - Playwright locator
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(
    locator: Locator,
    timeout: number = 10000,
  ): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Check if element is visible
   * @param {import('@playwright/test').Locator} locator - Playwright locator
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>}
   */
  async isVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.isVisible({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click an element
   * @param {import('@playwright/test').Locator} locator - Playwright locator
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Fill a text input
   * @param {import('@playwright/test').Locator} locator - Playwright locator
   * @param {string} text - Text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   * @returns {string}
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Take a screenshot
   * @param {string} name - Screenshot filename
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `TestResults/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  static getDuration(startTime: number): number {
    return Date.now() - startTime;
  }

  async pause(): Promise<void> {
    await this.page.pause();
  }
}
