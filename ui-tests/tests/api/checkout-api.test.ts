import { expect, test } from "@playwright/test";
import { meta, testData } from "reporting-labs";
import { buildCheckoutPayload } from "../../data/checkout";

test.describe("Checkout API", { tag: ["@Api", "@Smoke"] }, () => {
  test("creates a payment session with the requested order total", async ({
    request,
  }) => {
    meta({
      priority: "P0",
      severity: "critical",
      feature: "checkout",
      owner: "QA",
      layer: "API",
    });
    const checkoutPayload = buildCheckoutPayload();
    await testData(
      {
        reference: checkoutPayload.reference,
        amount: checkoutPayload.amount.value,
        currency: checkoutPayload.amount.currency,
        country: checkoutPayload.countryCode,
      },
      "Checkout request",
    );

    const response = await request.post("/.netlify/functions/sessions", {
      data: checkoutPayload,
    });

    expect(response.status()).toBe(201);

    const session = await response.json();
    expect(session).toMatchObject({
      amount: checkoutPayload.amount,
      countryCode: checkoutPayload.countryCode,
      reference: checkoutPayload.reference,
      mode: "embedded",
    });
    expect(session.id).toMatch(/^CS[A-Z0-9]+$/);
    expect(session.sessionData).toEqual(expect.any(String));
    expect(new Date(session.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  test("rejects an invalid payment-status redirect result", async ({
    request,
  }) => {
    meta({
      priority: "P1",
      severity: "major",
      feature: "payment status",
      owner: "QA",
      layer: "API",
    });

    const response = await request.post("/.netlify/functions/details", {
      data: { details: { redirectResult: "invalid-api-test-result" } },
    });

    expect(response.status()).toBe(422);

    const paymentStatus = await response.json();
    expect(paymentStatus).toMatchObject({
      status: 422,
      errorCode: "14_0391",
      errorType: "validation",
      message: "Invalid redirectResult provided",
    });
    expect(paymentStatus.pspReference).toEqual(expect.any(String));
  });
});
