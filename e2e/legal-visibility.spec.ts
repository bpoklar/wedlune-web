import { expect, test } from "@playwright/test";

for (const prefix of ["", "/sl", "/it"]) {
  for (const route of ["privacy", "terms"]) {
    test(`${prefix}/${route} text stays visible on a narrow mobile screen`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(`${prefix}/${route}`);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const article = page.locator(".legal-prose");
      await expect(article.locator("p").first()).toBeVisible();
      // Playwright's visibility check ignores opacity. Check ancestors too:
      // a reveal on the full document used to leave mobile text transparent.
      await expect.poll(() => article.evaluate((element) => {
        let opacity = 1;
        for (let node: Element | null = element; node; node = node.parentElement) {
          opacity *= Number(getComputedStyle(node).opacity);
        }
        return opacity;
      })).toBe(1);

      await article.locator("section").last().scrollIntoViewIfNeeded();
      await expect(article.locator("section").last()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
        .toBeLessThanOrEqual(1);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: testInfo.outputPath("legal-mobile.png") });
    });
  }
}
