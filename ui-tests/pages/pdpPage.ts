import { Page, expect } from "@playwright/test";

export class PdpPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("button", { name: /add to cart/i }),
    ).toBeVisible();

    await expect(this.page.getByText(/recommendations/i)).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.page.getByRole("button", { name: /add to cart/i }).click();
  }
}
