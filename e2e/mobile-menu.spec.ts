import { expect, test } from "@playwright/test";

test.describe("mobile menu motion", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith("mobile"), "mobile-only interaction");
    await page.goto("/");
    await page.waitForFunction(() => {
      const root = document.querySelector("#__nuxt") as HTMLElement & {
        __vue_app__?: { config: { globalProperties: { $nuxt: { isHydrating: boolean } } } };
      };
      return root.__vue_app__?.config.globalProperties.$nuxt.isHydrating === false;
    });
  });

  for (const action of ["button", "escape", "link"] as const) {
    test(`menu and header collapse together when closed by ${action}`, async ({ page }, testInfo) => {
      const menu = page.locator("#mobile-menu");
      const header = page.locator("[data-site-header]");
      const closedHeight = (await header.boundingBox())!.height;
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(menu.locator("a").first()).toBeFocused();
      const openHeight = (await menu.boundingBox())!.height;

      // Sample real rendered frames, including the header's background. A fade
      // alone leaves its full height in place until display:none abruptly snaps it.
      const frames = await page.evaluate(async (closeAction) => {
        const panel = document.querySelector<HTMLElement>("#mobile-menu")!;
        const siteHeader = document.querySelector<HTMLElement>("[data-site-header]")!;
        const button = siteHeader.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]')!;
        const samples: Array<{ height: number; headerHeight: number; top: number; opacity: number }> = [];

        if (closeAction === "escape") {
          panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        } else if (closeAction === "link") {
          panel.querySelector<HTMLAnchorElement>('a[href="#pricing"], a[href="/#pricing"]')!.click();
        } else {
          button.click();
        }

        const deadline = performance.now() + 2000;
        while (performance.now() < deadline) {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const panelBounds = panel.getBoundingClientRect();
          const headerBounds = siteHeader.getBoundingClientRect();
          samples.push({
            height: panelBounds.height,
            headerHeight: headerBounds.height,
            top: headerBounds.top,
            opacity: Number(getComputedStyle(panel).opacity),
          });
          if (getComputedStyle(panel).display === "none") break;
        }
        return samples;
      }, action);

      const intermediate = frames.filter((frame) => frame.height > 8 && frame.height < openHeight - 8);
      expect(intermediate.length).toBeGreaterThan(1);
      for (const frame of intermediate) {
        expect(frame.headerHeight).toBeCloseTo(closedHeight + frame.height, 0);
        expect(frame.top).toBeGreaterThanOrEqual(-1);
        expect(frame.opacity).toBeGreaterThan(0);
        expect(frame.opacity).toBeLessThan(1);
      }
      expect(frames.at(-1)!.height).toBe(0);
      await expect(menu).toBeHidden();
      await expect(menu).toHaveAttribute("inert", "");
      if (action === "escape") await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
      if (action === "link") await expect(page).toHaveURL(/#pricing$/);
      await page.screenshot({ path: testInfo.outputPath(`menu-closed-${action}.png`) });
    });
  }

  test("closing can be reversed without leaving the menu hidden", async ({ page }, testInfo) => {
    const button = page.locator('[aria-controls="mobile-menu"]');
    const menu = page.locator("#mobile-menu");
    await button.click();
    await expect(menu.locator("a").first()).toBeFocused();
    const openHeight = (await menu.boundingBox())!.height;
    await button.click();
    await page.waitForFunction((height) => {
      const panel = document.querySelector("#mobile-menu")!;
      const currentHeight = panel.getBoundingClientRect().height;
      return currentHeight > 0 && currentHeight < height - 8;
    }, openHeight);
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(menu.locator("a").first()).toBeFocused();
    expect((await menu.boundingBox())!.height).toBeCloseTo(openHeight, 0);
    await expect(menu).not.toHaveAttribute("inert", "");
    await page.screenshot({ path: testInfo.outputPath("menu-reopened.png") });
    await button.click();
    await expect(menu).toBeHidden();
  });

  test("reduced motion closes immediately and restores keyboard focus", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const button = page.locator('[aria-controls="mobile-menu"]');
    const menu = page.locator("#mobile-menu");
    await button.click();
    await expect(menu.locator("a").first()).toBeFocused();
    await expect(menu).toHaveCSS("transition-duration", "0s");
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
  });
});
