import { test as base, Page } from "@playwright/test";
import { PlpPage } from "../pages/plpPage";
import { PdpPage } from "../pages/pdpPage";

type AppFixtures = {
  page: Page;
  plpPage: PlpPage;
  pdpPage: PdpPage;
};

export const test = base.extend<AppFixtures>({
  page: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL!, { waitUntil: "load" });
    await page.waitForLoadState("domcontentloaded");
    
    // Global defensive handling (public site reality)
    const acceptCookies = page.getByRole("button", { name: /accept/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    await use(page);
  },

  plpPage: async ({ page }, use) => {
    const plpPage = new PlpPage(page);
    await plpPage.expectLoaded();
    await use(plpPage);
  },

  pdpPage: async ({ page }, use) => {
    const pdpPage = new PdpPage(page);
    await use(pdpPage);
  },
});

export { expect } from "@playwright/test";
