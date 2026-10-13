import { test, expect } from "../../fixtures/app-page";
import { meta } from "reporting-labs";

test.describe(
  "Plp Functional Test",
  { tag: ["@Plp", "@FullRegression"] },
  () => {
    test("User opens a product from PLP", async ({ plpPage, page }) => {
      meta({
        priority: "P1",
        severity: "major",
        feature: "product listing",
        owner: "QA",
        layer: "UI",
      });

      await plpPage.openProductByIndex(1);

      await expect(page).toHaveURL(/product/i);
    });
  },
);
