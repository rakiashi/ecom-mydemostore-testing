import { test } from "../../fixtures/app-page";

test("User sees all PDP elements", async ({ plpPage, pdpPage }) => {
  await plpPage.openProductByIndex(1);
  await pdpPage.expectLoaded();
});
