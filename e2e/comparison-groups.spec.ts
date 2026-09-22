import { expect, test, type Locator } from "@playwright/test";

const sampleToggle = (group: Locator) => group.evaluate(async (element) => {
  const button = element.querySelector<HTMLButtonElement>(".comparison-group-toggle")!;
  const panel = element.querySelector<HTMLElement>('[role="region"]')!;
  const readHeight = () => panel.getBoundingClientRect().height;
  const samples = [readHeight()];
  button.click();
  const deadline = performance.now() + 2000;
  let idleFrames = 0;
  while (performance.now() < deadline) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    samples.push(readHeight());
    const running = element.getAnimations({ subtree: true }).some((animation) => animation.playState === "running");
    idleFrames = running ? 0 : idleFrames + 1;
    if (idleFrames >= 3) break;
  }
  return samples;
});

test.describe("comparison group sliding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => {
      const root = document.querySelector("#__nuxt") as HTMLElement & {
        __vue_app__?: { config: { globalProperties: { $nuxt: { isHydrating: boolean } } } };
      };
      return root.__vue_app__?.config.globalProperties.$nuxt.isHydrating === false;
    });
    await page.locator("[data-full-comparison-toggle]").click();
    await page.locator("[data-full-comparison]").evaluate(async (element) => {
      await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished));
    });
  });

  test("every group changes height across multiple frames in both directions", async ({ page }, testInfo) => {
    const groups = page.locator("[data-comparison-group]");
    for (const group of await groups.all()) {
      const opening = await sampleToggle(group);
      const expandedHeight = opening.at(-1)!;
      expect(opening[0]).toBe(0);
      expect(expandedHeight).toBeGreaterThan(50);
      expect(opening.filter((height) => height > 1 && height < expandedHeight - 1).length).toBeGreaterThan(2);
      await expect(group.getByRole("button")).toHaveAttribute("aria-expanded", "true");

      const closing = await sampleToggle(group);
      expect(closing[0]).toBeCloseTo(expandedHeight, 0);
      expect(closing.at(-1)).toBe(0);
      expect(closing.filter((height) => height > 1 && height < expandedHeight - 1).length).toBeGreaterThan(2);
      const lastVisibleHeight = closing.filter((height) => height > 0).at(-1)!;
      expect(lastVisibleHeight).toBeLessThanOrEqual(1);
      await expect(group.getByRole("button")).toHaveAttribute("aria-expanded", "false");
      await expect(group.locator('[role="region"]')).toBeHidden();
    }
    await groups.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("comparison-groups-closed.png") });
  });

  test("switching groups slides the old one closed as the new one opens", async ({ page }, testInfo) => {
    const groups = page.locator("[data-comparison-group]");
    await sampleToggle(groups.first());
    const frames = await page.locator("[data-full-comparison]").evaluate(async (element) => {
      const groups = element.querySelectorAll<HTMLElement>("[data-comparison-group]");
      const oldPanel = groups[0]!.querySelector('[role="region"]')!;
      const newPanel = groups[1]!.querySelector('[role="region"]')!;
      const oldHeight = oldPanel.getBoundingClientRect().height;
      groups[1]!.querySelector<HTMLButtonElement>("button")!.click();
      const samples: Array<{ oldHeight: number; newHeight: number }> = [];
      const deadline = performance.now() + 2000;
      while (performance.now() < deadline) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        samples.push({ oldHeight: oldPanel.getBoundingClientRect().height, newHeight: newPanel.getBoundingClientRect().height });
        if (getComputedStyle(oldPanel).display === "none" && !newPanel.getAnimations({ subtree: true }).some((animation) => animation.playState === "running")) break;
      }
      return { oldHeight, samples };
    });
    expect(frames.samples.filter((frame) => frame.oldHeight > 1 && frame.oldHeight < frames.oldHeight - 1 && frame.newHeight > 1).length).toBeGreaterThan(2);
    await expect(groups.nth(0).locator('[role="region"]')).toBeHidden();
    await expect(groups.nth(1).getByRole("button")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator('[data-comparison-group] button[aria-expanded="true"]')).toHaveCount(1);
    await groups.nth(1).scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("comparison-group-open.png") });
  });

  test("a closing group can reopen without snapping or getting stuck", async ({ page }) => {
    const group = page.locator("[data-comparison-group]").first();
    const heights = await sampleToggle(group);
    const button = group.getByRole("button");
    await button.click();
    await page.waitForFunction((expandedHeight) => {
      const height = document.querySelector('[data-comparison-group] [role="region"]')!.getBoundingClientRect().height;
      return height > 1 && height < expandedHeight - 8;
    }, heights.at(-1)!);
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect.poll(async () => (await group.locator('[role="region"]').boundingBox())?.height).toBeCloseTo(heights.at(-1)!, 0);
    await expect(group.locator('[role="region"]')).not.toHaveAttribute("inert", "");
  });

  test("keyboard controls and reduced motion keep every group usable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const group = page.locator("[data-comparison-group]").first();
    const button = group.getByRole("button");
    const panel = group.locator('[role="region"]');
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    await page.keyboard.press("Space");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    await expect(button).toBeFocused();
  });
});
