import { expect, test } from "@playwright/test";

const checkoutPayload = {
  channel: "web",
  shopperName: {
    firstName: "API",
    lastName: "Tester",
    gender: "UNKNOWN",
  },
  shopperEmail: "api.tester@example.com",
  telephoneNumber: "0612345678",
  dateOfBirth: "1990-01-01",
  blockedPaymentMethods: ["wechatpayWeb"],
  returnUrl: "https://www.mystoredemo.io",
  reference: `MyStoreDemo-API-${Date.now()}`,
  shopperReference: "MyStoreDemo-api-test",
  lineItems: [
    {
      id: "001",
      quantity: 1,
      description: "Product",
      amountIncludingTax: 2499,
      amountExcludingTax: 2499,
      taxAmount: 0,
      taxPercentage: 0,
      taxCategory: "Zero",
    },
  ],
  countryCode: "NL",
  amount: { value: 2499, currency: "EUR" },
  billingAddress: {
    country: "NL",
    city: "Amsterdam",
    houseNumberOrName: "6",
    postalCode: "1012DJ",
    street: "Simon Carmiggeltstraat",
  },
  deliveryAddress: {
    country: "NL",
    city: "Amsterdam",
    houseNumberOrName: "6",
    postalCode: "1012DJ",
    street: "Simon Carmiggeltstraat",
  },
};

test.describe("Checkout API", { tag: ["@Api", "@Smoke"] }, () => {
  test("creates a payment session with the requested order total", async ({
    request,
  }) => {
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
