import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const assertA11y = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .exclude("nuxt-error-overlay")
    .analyze();
  expect(results.violations, results.violations.map((item) => `${item.id}: ${item.help}`).join("\n"))
    .toEqual([]);
};

const mockRsvp = {
  name: "Alex Morgan",
  rsvpStatus: "pending",
  mealPreference: null,
  dietaryNotes: null,
  menuId: null,
  coupleName: "Nina & Luka",
  menus: [],
  plusOnes: [],
  wishlist: {
    title: "A few things for our next chapter",
    message: "Your presence is the greatest gift.",
    items: [{
      id: "gift-1",
      title: "Handmade linen set",
      description: "Natural linen for slow Sunday mornings.",
      url: "https://example.com/gift",
      priceAmount: 80,
      currency: "EUR",
      category: "Home",
      desiredQuantity: 1,
      reservedQuantity: 0,
      remainingQuantity: 1,
      isPriority: true,
      imageUrl: null,
      reservedByYou: 0,
    }],
  },
  rsvpDesign: null,
};

test.describe("marketing, SEO, and navigation", () => {
  test("English and Slovenian homepages expose exact search signals", async ({ page }, testInfo) => {
    const localized = testInfo.project.name.startsWith("mobile")
      ? { path: "/sl", title: "Poročni planer za organizacijo poroke | Wedlune", h1: "Načrtujta poroko skupaj, brez kaosa v preglednicah." }
      : { path: "/", title: "Wedding Planner App for Couples | Wedlune", h1: "Plan your wedding together, without the spreadsheet chaos." };

    await page.goto(localized.path);
    await expect(page).toHaveTitle(localized.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(localized.h1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://wedlune.com${localized.path === "/" ? "" : localized.path}`);
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="sl"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      localized.path === "/" ? /\/og\/home-en-v2\.png$/ : /\/og\/home-sl\.png$/,
    );
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const schemaTypes = jsonLd.filter((value) => value.trim()).flatMap((value) => {
      const parsed = JSON.parse(value) as { "@graph"?: Array<{ "@type"?: string }> };
      return parsed["@graph"]?.map((node) => node["@type"]) ?? [];
    });
    expect(schemaTypes).toEqual(expect.arrayContaining(["Organization", "WebSite", "SoftwareApplication"]));
    await assertA11y(page);
    await expect(page).toHaveScreenshot(`home-${localized.path === "/" ? "en-desktop" : "sl-mobile"}.png`, { fullPage: true });
  });

  test("mobile navigation closes on Escape and returns focus", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith("mobile"), "mobile-only interaction");
    await page.goto("/");
    await page.waitForFunction(() => Boolean((document.querySelector("#__nuxt") as HTMLElement & { __vue_app__?: unknown })?.__vue_app__));
    const menuButton = page.getByRole("button", { name: "Open menu" });
    await menuButton.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await expect(menuButton).toBeFocused();
  });

  test("store calls to action stay non-interactive when URLs are unavailable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[aria-disabled="true"]', { hasText: "App Store" }).first()).toBeVisible();
    await expect(page.locator('[aria-disabled="true"]', { hasText: "Google Play" }).first()).toBeVisible();
    await expect(page.locator('a[href=""]')).toHaveCount(0);
  });

  test("plan comparison is compact, expandable, localized, and responsive", async ({ page }, testInfo) => {
    const isMobile = testInfo.project.name.startsWith("mobile");
    if (isMobile) await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(isMobile ? "/sl" : "/");

    const pricing = page.locator("#pricing");
    await pricing.scrollIntoViewIfNeeded();
    await expect(pricing.getByRole("heading", { level: 2 })).toBeVisible();

    const preview = pricing.locator("[data-comparison-preview]");
    await expect(preview).toBeVisible();
    await expect(preview.locator("[data-comparison-row]:visible")).toHaveCount(6);
    await expect(preview.locator('[data-comparison-row="guests"]:visible')).toContainText(
      isMobile ? "Do 25" : "Up to 25",
    );

    const toggle = pricing.locator("[data-full-comparison-toggle]");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(pricing.locator("[data-full-comparison]")).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    const fullComparison = pricing.locator("[data-full-comparison]");
    const groups = fullComparison.locator("details[data-comparison-group]");
    await expect(fullComparison).toBeVisible();
    await expect(groups).toHaveCount(5);
    await expect(fullComparison.locator("details[open]")).toHaveCount(0);

    const listsGroup = fullComparison.locator('details[data-comparison-group="lists"]');
    const listsSummary = listsGroup.locator("summary");
    await listsSummary.focus();
    await page.keyboard.press("Enter");
    await expect(listsGroup).toHaveAttribute("open", "");
    await expect(listsGroup.locator('[data-comparison-row="gallery"]:visible')).toContainText(
      isMobile ? "Do 10" : "Up to 10",
    );

    const recommendationsGroup = fullComparison.locator(
      'details[data-comparison-group="recommendations"]',
    );
    await recommendationsGroup.locator("summary").click();
    await expect(
      recommendationsGroup.locator('[data-comparison-row="venueLookups"]:visible'),
    ).toContainText(isMobile ? "Do 2 iskanj" : "Up to 2 lookups");

    await fullComparison.locator("[data-expand-all]").click();
    await expect(fullComparison.locator("details[open]")).toHaveCount(5);
    await expect(fullComparison.locator("[data-comparison-row]:visible")).toHaveCount(32);

    await fullComparison.locator("[data-collapse-all]").click();
    await expect(fullComparison.locator("details[open]")).toHaveCount(0);

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(fullComparison).toBeHidden();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await assertA11y(page);
  });

  test("reduced-motion users receive static transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const duration = await page.getByRole("button", { name: "Budget" }).evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
  });
});

test.describe("legal and recovery surfaces", () => {
  test("privacy page is readable and its table of contents works", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith("mobile"), "desktop visual baseline");
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
    await assertA11y(page);
    await expect(page).toHaveScreenshot("privacy-desktop.png", { fullPage: true });
  });

  test("legal content reflows at a 400% zoom equivalent", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/sl/terms");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("404 presents a branded recovery action", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('a[href="/"]').last()).toBeVisible();
    await assertA11y(page);
    await expect(page).toHaveScreenshot("404.png", { mask: [page.locator("nuxt-error-overlay")] });
  });
});

test.describe("private guest surfaces", () => {
  test("RSVP keeps its token out of metadata and covers loading, form, wishlist, and confirmation", async ({ page }) => {
    await page.route("**/functions/v1/handle-guest-rsvp", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 600));
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockRsvp) });
    });

    const response = await page.goto("/rsvp?token=private-e2e-token");
    expect(response?.headers()["cache-control"]).toContain("no-store");
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await expect(page.locator("#rsvp-loading")).toBeVisible();
    await expect(page).toHaveScreenshot("rsvp-loading.png");
    await expect(page.locator("#rsvp-submit")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://wedlune.com/rsvp");
    expect(await page.locator("head").innerHTML()).not.toContain("private-e2e-token");
    await assertA11y(page);
    await expect(page).toHaveScreenshot("rsvp-form-wishlist.png", { fullPage: true });
    await page.locator("#rsvp-accept").focus();
    await page.keyboard.press("Space");
    await page.locator("#rsvp-submit").click();
    await expect(page.locator("#rsvp-confirmation")).toBeFocused();
    await expect(page).toHaveScreenshot("rsvp-confirmation.png");
  });

  test("missing RSVP token has an accessible error state", async ({ page }) => {
    await page.goto("/rsvp");
    await expect(page.locator("#rsvp-error")).toBeVisible();
    await assertA11y(page);
    await expect(page).toHaveScreenshot("rsvp-error.png");
  });

  test("gallery covers loading, content, and token-safe metadata", async ({ page }) => {
    await page.route("**/functions/v1/serve-gallery", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          coupleName: "Nina & Luka",
          weddingDate: "2027-06-12",
          shotList: [{ category: "ceremony", items: [{ title: "The rings", isMustHave: true, sortOrder: 1, src: null }] }],
        }),
      });
    });
    const response = await page.goto("/shared-gallery?token=private-gallery-token");
    expect(response?.headers()["referrer-policy"]).toBe("no-referrer");
    await expect(page.locator("#shared-gallery-loading")).toBeVisible();
    await expect(page).toHaveScreenshot("gallery-loading.png");
    await expect(page.locator("#shared-gallery-content")).toBeVisible({ timeout: 15_000 });
    expect(await page.locator("head").innerHTML()).not.toContain("private-gallery-token");
    await assertA11y(page);
    await expect(page).toHaveScreenshot("gallery-content.png", { fullPage: true });
  });
});
