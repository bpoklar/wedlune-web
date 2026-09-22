import { expect, test } from "@playwright/test";

test.describe("comparison closing motion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => {
      const root = document.querySelector("#__nuxt") as HTMLElement & {
        __vue_app__?: { config: { globalProperties: { $nuxt: { isHydrating: boolean } } } };
      };
      return root.__vue_app__?.config.globalProperties.$nuxt.isHydrating === false;
    });
  });

  for (const expandedGroup of [false, true]) {
    test(`collapses all spacing with a feature group ${expandedGroup ? "expanded" : "collapsed"}`, async ({ page }, testInfo) => {
      const toggle = page.locator("[data-full-comparison-toggle]");
      const panel = page.locator("[data-full-comparison]");
      await toggle.click();
      await expect(panel).toBeVisible();
      await panel.evaluate(async (element) => {
        await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished));
      });
      if (expandedGroup) {
        await panel.locator(".comparison-group-toggle").first().click();
        await expect(panel.locator('[data-comparison-group][data-open="true"]')).toHaveCount(1);
        await panel.evaluate(async (element) => {
          await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished));
        });
      }

      // Include the final visible frame and the first hidden frame to catch
      // spacing that disappears only when Vue applies display:none.
      const frames = await panel.evaluate(async (element) => {
        const button = document.querySelector<HTMLButtonElement>("[data-full-comparison-toggle]")!;
        const cta = document.querySelector("#pricing .comparison-cta")!;
        const samples: Array<{ height: number; ctaTop: number; openGroups: number }> = [];
        button.click();
        const deadline = performance.now() + 2000;
        while (performance.now() < deadline) {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          samples.push({
            height: element.getBoundingClientRect().height,
            ctaTop: cta.getBoundingClientRect().top + window.scrollY,
            openGroups: element.querySelectorAll('[data-comparison-group][data-open="true"]').length,
          });
          if (getComputedStyle(element).display === "none") break;
        }
        return samples;
      });

      expect(frames.length).toBeGreaterThan(2);
      expect(frames.at(-1)!.height).toBe(0);
      expect(frames.at(-2)!.height).toBeLessThanOrEqual(1);
      expect(Math.abs(frames.at(-1)!.ctaTop - frames.at(-2)!.ctaTop)).toBeLessThanOrEqual(1);
      if (expandedGroup) {
        expect(frames.filter((frame) => frame.height > 1).every((frame) => frame.openGroups === 1)).toBe(true);
      }
      await expect(panel).toBeHidden();
      await expect(panel.locator('[data-comparison-group][data-open="true"]')).toHaveCount(0);
      await toggle.scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath("comparison-closed.png") });
      await toggle.click();
      await expect(panel).toBeVisible();
      await expect(panel.locator('[data-comparison-group][data-open="true"]')).toHaveCount(0);
    });
  }

  test("reduced motion closes without residual spacing", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const toggle = page.locator("[data-full-comparison-toggle]");
    const panel = page.locator("[data-full-comparison]");
    const section = page.locator("#pricing");
    const closedHeight = (await section.boundingBox())!.height;
    await toggle.click();
    await panel.locator(".comparison-group-toggle").first().click();
    await toggle.click();
    await expect(panel).toBeHidden();
    await expect(panel.locator('[data-comparison-group][data-open="true"]')).toHaveCount(0);
    expect((await section.boundingBox())!.height).toBeCloseTo(closedHeight, 0);
  });
});
