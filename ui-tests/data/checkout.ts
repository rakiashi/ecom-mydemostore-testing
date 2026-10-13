import { randomUUID } from "node:crypto";

export function buildCheckoutPayload() {
  const testRunId = randomUUID();

  return {
    channel: "web",
    shopperName: {
      firstName: "API",
      lastName: "Tester",
      gender: "UNKNOWN",
    },
    shopperEmail: `api.tester+${testRunId}@example.com`,
    telephoneNumber: "0612345678",
    dateOfBirth: "1990-01-01",
    blockedPaymentMethods: ["wechatpayWeb"],
    returnUrl: "https://www.mystoredemo.io",
    reference: `MyStoreDemo-API-${testRunId}`,
    shopperReference: `MyStoreDemo-api-${testRunId}`,
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
}
