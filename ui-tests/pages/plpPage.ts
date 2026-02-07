import { Page, expect } from "@playwright/test";

export class PlpPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(
      this.page
    .locator('a[href^="#/product/"]').first()
    ).toBeVisible();
  }

 async openProductByIndex(index: number): Promise<void> {
  await this.page
    .locator('a[href^="#/product/"]')
    .nth(index - 1)
    .click();
}
}
