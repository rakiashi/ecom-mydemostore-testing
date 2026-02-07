import { test, expect } from "../../fixtures/app-page";

test("User opens a product from PLP", async ({ plpPage, page }) => {
  await plpPage.openProductByIndex(1);

  await expect(page).toHaveURL(/product/i);
});
