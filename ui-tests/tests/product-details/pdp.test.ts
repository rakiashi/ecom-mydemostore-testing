import { test } from "../../fixtures/app-page";
import { meta } from "reporting-labs";

test.describe(
  "Plp Functional Test",
  { tag: ["@Plp", "@FullRegression"] },
  () => {
    test("User sees all PDP elements", async ({ plpPage, pdpPage }) => {
      meta({
        priority: "P1",
        severity: "major",
        feature: "product detail",
        owner: "QA",
        layer: "UI",
      });

      await plpPage.openProductByIndex(1);
      await pdpPage.expectLoaded();
    });
  },
);
