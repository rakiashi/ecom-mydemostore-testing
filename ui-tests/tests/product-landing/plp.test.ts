import { test, expect } from "../../fixtures/app-page";

test.describe(
  "Plp Functional Test",
  { tag: ["@Plp", "@FullRegression"] },
  () => {
    test("User opens a product from PLP", async ({ plpPage, page }) => {
      await plpPage.openProductByIndex(1);

      await expect(page).toHaveURL(/product/i);
    });
  },
);
