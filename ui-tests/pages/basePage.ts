import { Page, Locator } from "playwright";

export class BasePage {
  protected readonly page: Page;
  private readonly baseUrl: string;

  constructor(page: Page) {
    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL is not defined");
    }

    this.page = page;
    this.baseUrl = process.env.BASE_URL;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.baseUrl, { waitUntil: "networkidle" });
  }

  getPageTitle(): Promise<string> {
    return this.page.title();
  }

  getElement(selector: string): Locator {
    return this.page.locator(selector);
  }
}
