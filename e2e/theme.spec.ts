import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const prefix of ["", "/sl", "/it"]) {
  test(`${prefix || "en"}: restrained homepage surfaces and action states`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(prefix || "/");
    await expect(page.locator(".footer-cta-photo img")).toBeVisible();
    for (const selector of [".hero-section", ".feature-section", ".comparison-section"]) {
      await expect(page.locator(selector)).toHaveCSS("background-color", "rgb(250, 248, 244)");
      await expect(page.locator(selector)).toHaveCSS("background-image", "none");
    }
    for (const selector of [".proof-strip", ".feature-card:not(.feature-card-secondary)", ".plan-summary"]) {
      for (const panel of await page.locator(selector).all()) {
        await expect(panel).toHaveCSS("background-color", "rgb(255, 255, 255)");
        await expect(panel).toHaveCSS("background-image", "none");
      }
    }
    await expect(page.locator(".how-section")).toHaveCSS("background-color", "rgb(41, 39, 36)");
    await expect(page.locator(".how-section")).toHaveCSS("background-image", "none");
    await expect(page.locator(".how-title")).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.locator(".feature-card-secondary")).toHaveCSS("background-color", "rgb(238, 232, 222)");
    for (const preview of await page.locator(".feature-preview").all()) {
      await expect(preview).toHaveCSS("background-color", "rgb(41, 39, 36)");
      await expect(preview.locator(".feature-preview-screen")).toHaveCSS("overflow", "hidden");
      await expect(preview.locator("img")).toHaveCSS("border-width", "0px");
    }
    for (const description of await page.locator(".feature-card h3 + p").all()) {
      await expect(description).toHaveCSS("color", "rgb(87, 83, 77)");
      await expect(description).toHaveCSS("font-size", "16px");
    }
    const previewIcon = page.locator("svg.hero-screen-spark");
    await expect(previewIcon).toBeVisible();
    await expect(previewIcon.locator("path")).toHaveAttribute("d", /L12 21/);
    await expect(page.locator(".hero-kicker-rings")).toHaveCount(1);
    await expect(page.locator(".hero-rings, .feature-rings, .feature-card-rings, .how-rings, .pricing-rings, .faq-rings")).toHaveCount(0);
    const download = page.locator(".hero-section .store-badge-active").first();
    await expect(download).toHaveCSS("background-color", "rgb(41, 39, 36)");
    for (const line of await download.locator("span.block").all()) {
      await expect(line).toHaveCSS("color", "rgb(255, 255, 255)");
    }
    if (!info.project.name.startsWith("mobile")) {
      await download.hover();
      await expect(download).toHaveCSS("background-color", "rgb(59, 55, 49)");
      await page.mouse.down();
      try {
        await expect(download).toHaveCSS("background-color", "rgb(31, 29, 26)");
      } finally {
        // Release away from the link to avoid opening an external store tab.
        await page.mouse.move(0, 0);
        await page.mouse.up();
      }
    }
    const footerDownload = page.locator(".footer-cta .store-badge-active").first();
    await expect(footerDownload).toHaveCSS("background-color", "rgb(255, 255, 255)");
    for (const line of await footerDownload.locator("span.block").all()) {
      await expect(line).toHaveCSS("color", "rgb(41, 39, 36)");
    }
    const unavailable = page.locator(".store-badge-unavailable").first();
    if (await unavailable.count()) {
      await expect(unavailable).toHaveAttribute("aria-disabled", "true");
      await expect(unavailable).toHaveCSS("color", "rgb(87, 83, 77)");
    }
    // Full-page capture does not reliably load images below the viewport.
    // Scroll the card, not its intentionally cropped phone image: scrolling
    // the image can move content inside the card's overflow-hidden container.
    for (const card of await page.locator(".feature-card:has(.feature-preview)").all()) {
      await card.scrollIntoViewIfNeeded();
      await expect.poll(() => card.locator("img").evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
      expect(await card.evaluate((node) => node.scrollTop)).toBe(0);
    }
    for (const image of await page.locator(".hero-photo img, #how-it-works picture img, .footer-cta-photo img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(page.locator("[data-site-header]")).toHaveAttribute("data-visible", "true");
    await page.screenshot({ path: info.outputPath("polished-home.png"), fullPage: true });
    await page.locator(".hero-screen-label").screenshot({ path: info.outputPath("preview-icon.png") });
    await page.locator("#features").screenshot({ path: info.outputPath("polished-features.png") });
    await page.locator(".footer-cta").screenshot({ path: info.outputPath("polished-download.png") });
    expect((await new AxeBuilder({ page }).exclude("nuxt-error-overlay").analyze()).violations).toEqual([]);
  });

  test(`${prefix || "en"}: shared colors and contrast on every public page`, async ({ page }, info) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/", "/privacy", "/terms", "/delete-account", "/feedback", "/rsvp", "/shared-gallery", "/missing-color-page"]) {
      await page.goto(`${prefix}${path === "/" && prefix ? "" : path}`);
      await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 248, 244)");
      await expect(page.locator("body")).toHaveCSS("color", "rgb(41, 39, 36)");
      await page.locator("h1").first().waitFor();
      const result = await new AxeBuilder({ page }).exclude("nuxt-error-overlay").analyze();
      expect(result.violations, `${path}: ${JSON.stringify(result.violations)}`).toEqual([]);
      await page.screenshot({ path: info.outputPath(`${prefix.slice(1) || "en"}-${path.replaceAll("/", "") || "home"}.png`), fullPage: true });
    }
  });
}

for (const flow of ["login", "recovery", "signup", "invalid"]) {
  test(`callback ${flow} shares the palette without credentials`, async ({ page }, info) => {
    await page.goto(`/auth/callback/${flow}`);
    await expect(page.locator(".callback-shell")).toHaveCSS("color", "rgb(41, 39, 36)");
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
    await expect(page.locator("#rsvp-submit")).toHaveCSS("background-color", "rgb(41, 39, 36)");
    await expect(page.locator(".rsvp-invitation-header")).toHaveCSS("color", "rgb(41, 39, 36)");
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
    await expect(page.locator("[data-nav-cta]").first()).toHaveCSS("background-color", "rgb(41, 39, 36)");
  });
}
