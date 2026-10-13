import { test, expect } from "../../fixtures/app-page";
import { meta } from "reporting-labs";

test.describe("visual Testing", { tag: ["@Snapshot"] }, () => {
  test("Verify UI Design and CSS Consistency with Snapshot Testing on Plp Page", async ({
    page,
  }) => {
    meta({
      priority: "P2",
      severity: "minor",
      feature: "product listing visual",
      owner: "QA",
      layer: "UI",
    });

    const plpSection = page.locator("section");
    await expect(plpSection).toHaveScreenshot(
      "plp-ui-snapshot-desktop-chromium.png",
    );
  });

  test("Verify UI Design and CSS Consistency with Snapshot Testing on Pdp Page", async ({
    page,
    plpPage,
  }) => {
    meta({
      priority: "P2",
      severity: "minor",
      feature: "product detail visual",
      owner: "QA",
      layer: "UI",
    });

    await plpPage.openProductByIndex(1);
    await page.waitForLoadState("domcontentloaded");
    const component = page.locator('[class="product-detail"]');
    const pdpSection = await component.screenshot();
    expect(pdpSection).toMatchSnapshot("pdp-ui-snapshot-desktop-chromium.png");
  });
});
