# Test coverage gap analysis

This is a static review of the automated suite and application structure. Manual exploratory execution was blocked because the repository's required `playwright-cli` executable was not installed. The items below are therefore candidate coverage gaps, not manually reproduced defects.

## Current automated coverage

- PLP: open the first product and confirm product-detail navigation.
- PDP: confirm the add-to-cart action and recommendations are visible.
- Visual: PLP section and PDP component baselines.
- API: create a valid checkout session and validate an invalid payment-details redirect result.
- CI: the two functional UI tests run on desktop Chromium, Firefox, and WebKit.

## Missing UI coverage

| Priority | Area                   | Candidate scenarios                                                                                                                                        |
| -------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | Cart                   | Add one and multiple products; validate item identity, quantity, unit price, total, removal, and empty-cart state.                                         |
| P0       | Checkout               | Navigate from cart to checkout; validate order summary, amount consistency, available payment component, and successful sandbox completion.                |
| P0       | Payment outcomes       | Cover authorized, refused, cancelled, pending, timeout, retry, and redirect-return behavior with approved sandbox data.                                    |
| P1       | PLP content            | Validate that every rendered product card has an accessible link, name, price, and usable image; verify product links are unique.                          |
| P1       | PLP-to-PDP consistency | Verify selected product name, image, and price remain consistent from listing through product detail, cart, and checkout.                                  |
| P1       | PDP behavior           | Add to cart, repeated add, recommendations navigation, and browser back/forward behavior.                                                                  |
| P1       | State persistence      | Validate cart behavior after reload, route changes, a new tab/context, and cleared storage according to the intended persistence rules.                    |
| P1       | Accessibility          | Keyboard-only navigation, logical tab order, visible focus, meaningful names, heading structure, image alternatives, and automated accessibility scanning. |
| P1       | Responsive interaction | Re-run complete journeys at 320x568, 375x667 or 390x844, 768x1024, 1024x768, 1440x900, and 1920x1080—not screenshots alone.                                |
| P1       | Mobile projects        | Add functional mobile Chrome and mobile Safari coverage to CI; these projects currently exist but are not in the regression matrix.                        |
| P2       | Error recovery         | Unavailable product/API, slow response, offline transition, failed resource, refresh, retry, and user-facing error recovery.                               |
| P2       | Navigation             | Direct deep links, unknown routes, logo/home navigation, browser history, and preservation of state during navigation.                                     |
| P2       | Visual coverage        | Add stable Linux CI baselines or a reviewed cross-platform baseline strategy; cover cart, checkout, error, and confirmation states.                        |
| P2       | Localization           | Currency, locale, address formats, long translated text, and text expansion if multiple locales are supported.                                             |

Search, filtering, sorting, authentication, promotions, and inventory tests should be added only if those capabilities are confirmed requirements; the current suite does not establish that they exist.

## Missing API coverage

| Priority | Endpoint/area         | Candidate scenarios                                                                                                                                        |
| -------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | `sessions` contract   | Validate the full response schema, line-item echo, merchant/country data, expiry window, unique session ID, and absence of unexpected sensitive fields.    |
| P0       | `details` outcomes    | Validate approved sandbox result codes for authorized, refused, cancelled, pending, expired, and replayed payment details.                                 |
| P1       | Required fields       | Omit each required session field independently and validate consistent 4xx status, error code, and message schema.                                         |
| P1       | Amount boundaries     | Zero, negative, fractional/invalid integer, very large value, line-item/total mismatch, unsupported currency, and currency/country mismatch.               |
| P1       | Input validation      | Invalid country, malformed address/email/date, empty line items, invalid quantity, special characters, and oversized strings.                              |
| P1       | Protocol behavior     | Wrong HTTP method, missing/incorrect content type, malformed JSON, CORS policy, and unsupported accept headers.                                            |
| P1       | Replay and uniqueness | Duplicate merchant reference, repeated payment details, expired session, idempotency behavior, and parallel session requests.                              |
| P1       | Privacy/security      | Confirm logs and responses do not expose payment/session credentials; validate injection-shaped strings and security headers without using real card data. |
| P2       | Resilience            | Service timeout, upstream 5xx, retry policy, rate limiting, and stable error mapping. These may require a controllable test environment or mocks.          |
| P2       | Performance           | Establish response-time thresholds and concurrent request expectations for session creation and status handling.                                           |

## Test-data management

Implemented now:

- `ui-tests/data/checkout.ts` centralizes checkout payload construction.
- Every API test receives UUID-based shopper and merchant references to avoid collisions during parallel or repeated runs.
- ReportingLabs masks `sessionData`, `paymentData`, and `redirectResult` in captured API evidence.
- Generated reports and their history are excluded from Git while CI uploads the report artifact.

Recommended next steps:

1. Add typed builders for products, addresses, amounts, and expected API errors rather than duplicating literals in tests.
2. Define named valid, boundary, and invalid datasets with the business reason for each value.
3. Keep environment URLs and non-secret defaults in environment files; keep credentials and tokens in CI secrets only.
4. Add per-test browser-context cleanup for cookies, local storage, and session storage when isolation is part of the scenario.
5. Use only provider-approved sandbox payment data and never persist real card, token, or session values in source control or reports.
6. Document ownership, creation, expiry, and cleanup for any server-side fixtures when a controllable test environment becomes available.
7. Add contract schemas for request and response bodies so data drift fails with a precise message.

## Manual-testing blocker

The local manual-testing skill requires `playwright-cli` for all browser interactions and prohibits substitution. At review time, `playwright-cli` returned `command not found`, so responsive, keyboard, visual, and state-transition scenarios remain unexecuted rather than being reported as passed or failed.

## Automated verification observation

During the ReportingLabs verification run, the Firefox PDP regression timed out once while setting up the shared `page` fixture and passed on its configured retry. Chromium and WebKit passed on the first attempt. This is recorded as a flaky automation result, not as an application defect; fixture navigation timing and public-site availability should be monitored before changing the timeout.
