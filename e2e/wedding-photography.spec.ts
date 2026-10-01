import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import en from "../i18n/locales/en.json" with { type: "json" };
import sl from "../i18n/locales/sl.json" with { type: "json" };
import it from "../i18n/locales/it.json" with { type: "json" };

async function checkPhoto(image: Locator, name: string, alt: string) {
  await image.scrollIntoViewIfNeeded();
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("alt", alt);
  await expect(image).toHaveAttribute("loading", "lazy");
  await expect(image).toHaveAttribute("decoding", "async");
  await expect(image).toHaveAttribute("width", "1440");
  await expect(image).toHaveAttribute("height", "1080");
  await expect(image).toHaveAttribute("src", `/img/editorial/${name}-1440.jpg`);
  await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  expect(await image.evaluate((node: HTMLImageElement) => node.currentSrc))
    .toMatch(new RegExp(`/img/editorial/${name}-(720|1440)\\.avif$`));
  for (const format of ["avif", "webp"]) {
    const source = image.locator("..").locator(`source[type="image/${format}"]`);
    await expect(source).toHaveAttribute("srcset", `/img/editorial/${name}-720.${format} 720w, /img/editorial/${name}-1440.${format} 1440w`);
    await expect(source).toHaveAttribute("sizes", /min-width/);
  }
  const box = (await image.boundingBox())!;
  expect(box.width / box.height).toBeCloseTo(4 / 3, 1);
}

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  for (const selector of ["#how-it-works h2", ".footer-title", ".footer-body", ".footer-cta .store-badge"]) {
    for (const element of await page.locator(selector).all()) {
      const box = (await element.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
      expect(await element.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    }
  }
}

for (const { path, catalog, locale } of [
  { path: "/", catalog: en, locale: "en" },
  { path: "/sl", catalog: sl, locale: "sl" },
  { path: "/it", catalog: it, locale: "it" },
]) {
  test(`homepage photos load and fit in ${locale}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const planning = page.locator('#how-it-works picture img');
    const garden = page.locator('.footer-cta-photo img');
    await checkPhoto(planning, "planning-desk", catalog.home.how.photoAlt);
    await page.locator("#how-it-works").screenshot({ path: testInfo.outputPath(`how-${locale}.png`) });
    await checkPhoto(garden, "garden-reception", catalog.footer.photoAlt);
    await expect(page.locator(".footer-ornament")).toHaveCount(0);
    await expect(page.locator("#how-it-works li")).toHaveCount(3);
    await expect(page.locator(".footer-cta .store-badge")).toHaveCount(2);
    for (const id of ["features", "how-it-works", "pricing", "faq", "download"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    const heroStores = await page.locator(".hero-section .store-badge").evaluateAll((nodes) => nodes.map((node) => [node.tagName, node.getAttribute("href"), node.getAttribute("aria-disabled")]));
    expect(await page.locator(".footer-cta .store-badge").evaluateAll((nodes) => nodes.map((node) => [node.tagName, node.getAttribute("href"), node.getAttribute("aria-disabled")]))).toEqual(heroStores);
    const text = (await page.locator(".footer-cta-content").boundingBox())!;
    const photo = (await garden.boundingBox())!;
    if (page.viewportSize()!.width >= 1024) {
      expect(photo.x).toBeGreaterThan(text.x + text.width);
      expect(text.width / (text.width + photo.width)).toBeCloseTo(0.55, 2);
    } else {
      expect(photo.y).toBeGreaterThan(text.y + text.height);
    }
    await expectNoOverflow(page);
    await page.locator(".footer-cta").screenshot({ path: testInfo.outputPath(`footer-${locale}.png`) });
    const accessibility = await new AxeBuilder({ page }).include("#how-it-works").include(".footer-cta").analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test("Italian photography sections fit a 320px screen", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/it");
  await checkPhoto(page.locator("#how-it-works picture img"), "planning-desk", it.home.how.photoAlt);
  await page.locator("#how-it-works").screenshot({ path: testInfo.outputPath("how-it-320.png") });
  await checkPhoto(page.locator(".footer-cta-photo img"), "garden-reception", it.footer.photoAlt);
  await expectNoOverflow(page);
  await page.locator(".footer-cta").screenshot({ path: testInfo.outputPath("footer-it-320.png") });
});

test("legal and guest pages do not gain marketing photos", async ({ page }) => {
  for (const path of ["/privacy", "/sl/terms", "/it/feedback", "/shared-gallery"]) {
    await page.goto(path);
    await expect(page.locator(".footer-cta-photo")).toHaveCount(0);
    await expect(page.locator("#how-it-works picture")).toHaveCount(0);
    if (path !== "/shared-gallery") {
      await expect(page.locator(".footer-cta")).toHaveCount(0);
      await expect(page.locator(".footer-lower-standalone")).toHaveCount(1);
    }
  }
});
