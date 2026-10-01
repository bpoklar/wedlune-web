import { expect, test, type Page, type Route } from "@playwright/test";

const token = "free-rsvp-test-token";
const freeRsvp = {
  name: "Alex Morgan",
  isCouple: false,
  rsvpStatus: "pending",
  mealPreference: null,
  dietaryNotes: null,
  menuId: null,
  coupleName: "Nina & Luka",
  menus: [],
  plusOnes: [],
  wishlist: null,
  rsvpDesign: null,
};

const guestLimitError = {
  error: "This invitation cannot accept responses right now.",
  code: "free_guest_limit_exceeded",
};

async function mockGuestRequests(page: Page, handler: (route: Route) => Promise<void>) {
  // Intercept every Edge Function so these fixtures cannot write live guest data.
  await page.route("**/functions/v1/**", async (route) => {
    expect(new URL(route.request().url()).pathname).toBe("/functions/v1/handle-guest-rsvp");
    expect(route.request().headers()["x-rsvp-token"]).toBe(token);
    await handler(route);
  });
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("Free RSVP loads its default presentation without a wishlist and saves a response", async ({ page }, testInfo) => {
  const requests: string[] = [];
  let submittedBody: unknown;
  await mockGuestRequests(page, async (route) => {
    requests.push(route.request().method());
    if (route.request().method() === "POST") {
      submittedBody = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
      return;
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(freeRsvp) });
  });

  await page.goto(`/rsvp?token=${token}`);
  await expect(page.locator("#rsvp-submit")).toBeVisible();
  await expect(page.locator("#rsvp-page")).toHaveClass(/rsvp-template-classic/);
  await expect(page.getByRole("heading", { name: freeRsvp.name, exact: true })).toBeVisible();
  await expect(page.locator("#wishlist-section")).toHaveCount(0);
  await expect(page.locator(".rsvp-hero-frame")).toHaveCount(0);
  await expect(page.locator("#rsvp-premium-unavailable")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("free-rsvp-form.png"), fullPage: true });

  await page.locator("label:has(#rsvp-accept)").click();
  await page.locator("#rsvp-submit").click();
  await expect(page.locator("#rsvp-confirmation")).toBeVisible();
  await expect(page.locator("#rsvp-confirmation")).toBeFocused();
  await expect(page.locator("#wishlist-section")).toHaveCount(0);
  expect(requests).toEqual(["GET", "POST"]);
  expect(submittedBody).toMatchObject({ rsvpStatus: "accepted", guests: [] });
  await page.screenshot({ path: testInfo.outputPath("free-rsvp-confirmation.png"), fullPage: true });
});

test("Free weddings over 50 invited people show the unavailable state on load", async ({ page }, testInfo) => {
  const requests: string[] = [];
  await mockGuestRequests(page, async (route) => {
    requests.push(route.request().method());
    await route.fulfill({ status: 403, contentType: "application/json", body: JSON.stringify(guestLimitError) });
  });

  await page.goto(`/rsvp?token=${token}`);
  await expect(page.locator("#rsvp-premium-unavailable")).toBeVisible();
  await expect(page.getByRole("heading", { name: "RSVP Currently Unavailable", exact: true })).toBeVisible();
  await expect(page.locator("#rsvp-submit")).toHaveCount(0);
  await expect(page.locator("#wishlist-section")).toHaveCount(0);
  await expect(page.locator("#rsvp-error")).toHaveCount(0);
  expect(requests).toEqual(["GET"]);
  await page.screenshot({ path: testInfo.outputPath("free-rsvp-guest-limit.png"), fullPage: true });
});

test("Free RSVP hides its form when the guest limit is exceeded before submission", async ({ page }, testInfo) => {
  const requests: string[] = [];
  await mockGuestRequests(page, async (route) => {
    const method = route.request().method();
    requests.push(method);
    await route.fulfill({
      status: method === "POST" ? 403 : 200,
      contentType: "application/json",
      body: JSON.stringify(method === "POST" ? guestLimitError : freeRsvp),
    });
  });

  await page.goto(`/rsvp?token=${token}`);
  await expect(page.locator("#rsvp-submit")).toBeVisible();
  await page.locator("label:has(#rsvp-accept)").click();
  await page.locator("#rsvp-submit").click();

  await expect(page.locator("#rsvp-premium-unavailable")).toBeVisible();
  await expect(page.locator("#rsvp-submit")).toHaveCount(0);
  await expect(page.locator("#rsvp-confirmation")).toHaveCount(0);
  await expect(page.locator("#wishlist-section")).toHaveCount(0);
  expect(requests).toEqual(["GET", "POST"]);
  await page.screenshot({ path: testInfo.outputPath("free-rsvp-submit-guest-limit.png"), fullPage: true });
});
