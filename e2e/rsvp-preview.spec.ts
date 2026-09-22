import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const design = {
  version: 1, template: "modern", accentColor: "#F2C94C", backgroundColor: "#101820", surfaceColor: "#17212B",
  invitationHeading: "Živa + Blaž invite you", welcomeMessage: "Celebrate with us.\nDinner and dancing to follow.",
  confirmationMessage: "Thank you!\nSee you soon.", heroImageUrl: null,
};
const previewUrl = (value: unknown, query = "") => `/rsvp?preview=1${query}#rsvp-preview-${Buffer.from(JSON.stringify(value)).toString("base64url")}`;

for (const template of ["classic", "botanical", "modern"]) {
  test(`preview ${template} renders and simulates responses without guest requests`, async ({ page }, testInfo) => {
    const guestRequests: string[] = [];
    await page.route("**/functions/v1/**", (route) => {
      guestRequests.push(route.request().url());
      return route.abort();
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(previewUrl({ ...design, template }, "&token=must-not-be-used"));
    await expect(page.getByRole("heading", { name: "Guest page preview" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your guest", exact: true })).toBeVisible();
    await expect(page.getByText(design.invitationHeading, { exact: true })).toBeVisible();
    await expect(page.getByText(design.welcomeMessage)).toHaveCSS("white-space", "pre-line");
    await expect(page.locator("#rsvp-accept")).toBeEnabled();
    await page.locator('label:has(#rsvp-accept)').click();
    await page.locator("#rsvp-submit").click();
    await expect(page.locator("#rsvp-confirmation")).toBeVisible();
    await expect(page.getByText(design.confirmationMessage)).toHaveCSS("white-space", "pre-line");
    await page.getByRole("button", { name: "Declined response", exact: true }).click();
    await expect(page.locator("#rsvp-confirmation")).toBeVisible();
    await expect(page.getByRole("button", { name: "Declined response", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Invitation", exact: true }).click();
    expect(guestRequests).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`preview-${template}.png`), fullPage: true });
  });
}

test("malformed preview stays isolated even with a valid-looking token", async ({ page }) => {
  const requests: string[] = [];
  await page.route("**/functions/v1/**", (route) => { requests.push(route.request().url()); return route.abort(); });
  await page.goto("/rsvp?preview=1&token=ignored#design=%7Bbroken");
  await expect(page.getByRole("alert")).toContainText("Open a new preview");
  await expect(page.locator("#rsvp-submit")).toHaveCount(0);
  expect(requests).toEqual([]);
});

test("unavailable image collapses and custom copy renders without couple names", async ({ page }, testInfo) => {
  await page.route("**/missing-hero.jpg", (route) => route.fulfill({ status: 404, body: "" }));
  await page.route("**/functions/v1/handle-guest-rsvp", (route) => route.fulfill({
    contentType: "application/json", body: JSON.stringify({
      name: "Guest", coupleName: null, rsvpStatus: "pending", menus: [], plusOnes: [],
      rsvpDesign: { ...design, heroImageUrl: "http://127.0.0.1:3200/missing-hero.jpg" },
    }),
  }));
  await page.goto("/rsvp?token=legacy-fixture");
  await expect(page.getByText(design.welcomeMessage)).toBeVisible();
  await expect(page.locator(".rsvp-hero-frame")).toHaveCount(0);
  await expect(page.locator(".rsvp-modern-has-hero")).toHaveCount(0);
  await expect(page.locator("#rsvp-preview-toolbar")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("public-image-fallback.png"), fullPage: true });
});

test("Slovenian preview uses localized controls", async ({ page }) => {
  await page.goto("/sl/rsvp?preview=1");
  await expect(page.getByRole("heading", { name: "Predogled strani za goste" })).toBeVisible();
  await page.getByRole("button", { name: "Potrjena udeležba", exact: true }).click();
  await expect(page.locator("#rsvp-confirmation")).toBeVisible();
});

for (const template of ["classic", "botanical", "modern"]) {
  test(`preview ${template} keeps image framing at each viewport`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(previewUrl({
      ...design, template,
      heroImageUrl: "http://127.0.0.1:3200/img/editorial/roses-720.webp",
      heroImageFocalX: 0.25, heroImageFocalY: 0.75, heroImageZoom: 1.4,
    }));
    const image = page.locator(".rsvp-hero-image");
    await expect(image).toBeVisible();
    await expect(image).toHaveCSS("object-position", "25% 75%");
    await expect(image).toHaveCSS("transform", "matrix(1.4, 0, 0, 1.4, 0, 0)");
    await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const ratio = template === "classic" ? "16 / 9"
      : template === "modern" && !testInfo.project.name.startsWith("mobile") ? "6 / 5" : "4 / 3";
    await expect(page.locator(".rsvp-hero-frame")).toHaveCSS("aspect-ratio", ratio);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`preview-${template}-image.png`), fullPage: true });
  });
}
