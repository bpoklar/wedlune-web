import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const prefix of ["", "/sl"]) {
  test(`${prefix || "en"}: shared colors and contrast on every public page`, async ({ page }, info) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/", "/privacy", "/terms", "/delete-account", "/feedback", "/rsvp", "/shared-gallery", "/missing-color-page"]) {
      await page.goto(`${prefix}${path === "/" && prefix ? "" : path}`);
      await expect(page.locator("body")).toHaveCSS("background-color", "rgb(253, 248, 242)");
      await expect(page.locator("body")).toHaveCSS("color", "rgb(44, 44, 44)");
      await page.locator("h1").first().waitFor();
      const result = await new AxeBuilder({ page }).exclude("nuxt-error-overlay").analyze();
      expect(result.violations, `${path}: ${JSON.stringify(result.violations)}`).toEqual([]);
      await page.screenshot({ path: info.outputPath(`${prefix ? "sl" : "en"}-${path.replaceAll("/", "") || "home"}.png`), fullPage: true });
    }
  });
}

for (const flow of ["login", "recovery", "signup", "invalid"]) {
  test(`callback ${flow} shares the palette without credentials`, async ({ page }, info) => {
    await page.goto(`/auth/callback/${flow}`);
    await expect(page.locator(".callback-shell")).toHaveCSS("color", "rgb(44, 44, 44)");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`callback-${flow}.png`) });
  });
}

for (const template of ["classic", "botanical", "modern"]) {
  test(`RSVP ${template}: explicit ownership, wishlist contrast and route isolation`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    let custom = false;
    await page.route("**/functions/v1/handle-guest-rsvp", (route) => route.fulfill({
      contentType: "application/json", body: JSON.stringify({
        name: "Alex", isCouple: false, coupleName: "Nina & Luka", rsvpStatus: "pending",
        menus: [], plusOnes: [],
        rsvpDesign: {
          version: 1, template, ...(custom ? { colorMode: "custom" } : {}),
          accentColor: "#B88A4A", backgroundColor: "#FAF7F2", surfaceColor: "#FFFFFF",
          invitationHeading: "Our invitation",
        },
        wishlist: { title: "Our wishlist", message: null, items: [{ id: "gift", title: "Dinner plates", description: null,
          productUrl: null, imageUrl: null, desiredQuantity: 1, reservedQuantity: 0, remainingQuantity: 1,
          reservedByYou: 0, isPriority: true, priceAmount: null, currency: null, category: null }] },
      }),
    }));
    await page.route("**/functions/v1/handle-wishlist-reservation", (route) => route.fulfill({
      status: 500, contentType: "application/json", body: JSON.stringify({ error: "Please try again." }),
    }));
    await page.goto("/rsvp?token=theme-only-fixture");
    await expect(page.locator("#rsvp-submit")).toHaveCSS("background-color", "rgb(201, 169, 110)");
    await expect(page.locator(".rsvp-invitation-header")).toHaveCSS("color", "rgb(44, 44, 44)");
    custom = true;
    await page.reload();
    await expect(page.locator("#rsvp-submit")).toHaveCSS("background-color", "rgb(184, 138, 74)");
    await page.locator("#wishlist-reserve-gift").click();
    await expect(page.getByText("Please try again.")).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`rsvp-${template}-custom.png`), fullPage: true });
    // Client navigation must dispose of all guest-theme overrides.
    await page.locator('a[href="/"]').last().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator(".rsvp-theme")).toHaveCount(0);
    await expect(page.locator("[data-nav-cta]").first()).toHaveCSS("background-color", "rgb(44, 44, 44)");
  });
}
