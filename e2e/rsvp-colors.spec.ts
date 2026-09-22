import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const designs = [
  { name: "brand", palette: null },
  { name: "custom-light", palette: { accentColor: "#DFC4CE", backgroundColor: "#FFF9F4", surfaceColor: "#FFFFFF" } },
  { name: "custom-dark", palette: { accentColor: "#F2C94C", backgroundColor: "#101820", surfaceColor: "#17212B" } },
  { name: "custom-low-contrast", palette: { accentColor: "#777777", backgroundColor: "#777777", surfaceColor: "#777777" } },
  { name: "custom-rose", palette: { accentColor: "#A26769", backgroundColor: "#F8F0F0", surfaceColor: "#FFFDFB" } },
];

for (const design of designs) {
  test(`RSVP ${design.name} buttons, selection and keyboard focus`, async ({ page }, testInfo) => {
    let releaseSave: (() => void) | undefined;
    const saveGate = new Promise<void>((resolve) => { releaseSave = resolve; });
    await page.route("**/functions/v1/handle-guest-rsvp", async (route) => {
      if (route.request().method() === "POST") {
        await saveGate;
        await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
        return;
      }
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
        name: "Alenka", isCouple: true, rsvpStatus: "accepted", coupleName: "Blaz & Alenka",
        menuId: null, mealPreference: null, dietaryNotes: null,
        menus: [
          { id: "vegetarian", label: "Garden menu", category: "Vegetarian", coverImageUrl: null, courses: [{ id: "course-1", label: "Seasonal vegetables", description: null }] },
          { id: "partner-menu", label: "Menu 2 Paartner", category: "Vegetarian", coverImageUrl: null, courses: [{ id: "course-2", label: "Solata", description: null }, { id: "course-3", label: "Ajvar", description: null }] },
        ],
        plusOnes: [{ id: "companion", name: "Filip", rsvpStatus: "accepted", menuId: null, mealPreference: null, dietaryNotes: null }],
        wishlist: null,
        rsvpDesign: design.palette ? { version: 1, template: "classic", ...design.palette, invitationHeading: "Celebrate with us", heroImageUrl: null } : null,
      }) });
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/rsvp?token=palette-fixture");
    const save = page.locator("#rsvp-submit");
    await expect(save).toBeVisible();
    await expect(page.locator("#rsvp-accept")).toHaveCount(0);
    // Different course counts must not produce different card heights,
    // including across rows and between the main guest and companion.
    for (const group of ["#menuSelect", "#menu_0"]) {
      const cards = page.locator(`${group} > label`);
      await expect(cards).toHaveCount(3);
      await expect.poll(async () => {
        const heights = await cards.evaluateAll((elements) =>
          elements.map((element) => element.getBoundingClientRect().height),
        );
        return Math.max(...heights) - Math.min(...heights);
      }).toBeLessThan(1);
      for (const card of await cards.all()) {
        expect(await card.evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
      }
    }
    const mainCards = await page.locator('#menuSelect > label').evaluateAll((elements) =>
      elements.map((element) => {
        const { width, height, x } = element.getBoundingClientRect();
        return { width, height, x };
      }),
    );
    const companionCards = await page.locator('#menu_0 > label').evaluateAll((elements) =>
      elements.map((element) => {
        const { width, height, x } = element.getBoundingClientRect();
        return { width, height, x };
      }),
    );
    expect(companionCards).toEqual(mainCards);
    if (design.name === "brand") {
      await expect(save).toHaveCSS("background-color", "rgb(201, 169, 110)");
      await expect(save).toHaveCSS("color", "rgb(44, 44, 44)");
      if (!testInfo.project.name.startsWith("mobile")) {
        await save.hover();
        await expect(save).toHaveCSS("background-color", "rgb(190, 155, 95)");
        await page.mouse.move(0, 0);
      }
    }
    const partnerMenu = page.locator('#menuSelect label:has(input[value="partner-menu"])');
    const menuSize = await partnerMenu.boundingBox();
    await partnerMenu.click();
    await expect(partnerMenu.locator("input")).toBeChecked();
    await expect(partnerMenu).toHaveCSS("box-shadow", "none");
    await expect(partnerMenu).toHaveCSS("border-width", "1px");
    await expect(partnerMenu.locator(".rsvp-selection-mark")).toBeVisible();
    expect((await partnerMenu.boundingBox())?.height).toBe(menuSize?.height);
    await expect(partnerMenu).toHaveCSS("outline-style", "none");
    await page.locator("#menuSelect").screenshot({ path: testInfo.outputPath(`rsvp-${design.name}-single-border.png`) });
    const companionMenu = page.locator('#menu_0 label:has(input[value="partner-menu"])');
    await companionMenu.click();
    await expect(companionMenu.locator("input")).toBeChecked();
    await page.locator("#menu_0").screenshot({ path: testInfo.outputPath(`rsvp-${design.name}-companion-menus.png`) });
    const menu = page.locator('#menuSelect label:has(input[value="vegetarian"])');
    await menu.click();
    await expect(menu.locator("input")).toBeChecked();
    await expect(menu).toHaveCSS("border-width", "1px");
    await expect(partnerMenu).toHaveCSS("border-width", "1px");
    await expect(menu.locator(".rsvp-selection-mark")).toBeVisible();
    await expect(partnerMenu.locator(".rsvp-selection-mark")).toBeHidden();
    await expect(menu).toHaveCSS("box-shadow", "none");
    // Move focus using the keyboard so focus-visible is exercised on the label.
    await menu.locator("input").focus();
    await page.keyboard.press("ArrowLeft");
    const firstChoice = page.locator("#menuSelect label").first();
    await expect(firstChoice.locator("input")).toBeChecked();
    await expect(firstChoice.locator(".rsvp-selection-mark")).toBeVisible();
    await expect(firstChoice).toHaveCSS("outline-style", "solid");
    await expect(firstChoice).toHaveCSS("outline-width", "3px");

    const decline = page.locator('label:has(input[name="rsvpStatus_0"][value="declined"])');
    await decline.click();
    await expect(decline.locator("input")).toBeChecked();
    await expect(decline).toHaveCSS("border-width", "1px");
    await expect(decline).toHaveCSS("box-shadow", "none");
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
    await decline.locator("input").focus();
    await page.keyboard.press("Tab");
    await expect(save).toBeFocused();
    await expect(save).toHaveCSS("outline-style", "solid");
    await expect(page.locator(".skip-link")).toHaveCSS("opacity", "0");
    await page.screenshot({ path: testInfo.outputPath(`rsvp-${design.name}-form.png`), fullPage: true });
    await save.click();
    await expect(save).toBeDisabled();
    await expect(save).toHaveCSS("box-shadow", "none");
    releaseSave!();
    await expect(page.getByRole("heading", { name: "Details saved" })).toBeVisible();
    const update = page.getByRole("button", { name: "Update details", exact: true });
    await expect(update).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`rsvp-${design.name}-confirmation.png`), fullPage: true });
    await update.click();
    await expect(save).toBeEnabled();
    await expect(decline.locator("input")).toBeChecked();
  });
}
