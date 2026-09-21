import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const designs = [
  { name: "brand", palette: null },
  { name: "custom-light", palette: { accentColor: "#DFC4CE", backgroundColor: "#FFF9F4", surfaceColor: "#FFFFFF" } },
  { name: "custom-dark", palette: { accentColor: "#F2C94C", backgroundColor: "#101820", surfaceColor: "#17212B" } },
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
        menus: [{ id: "vegetarian", label: "Garden menu", category: "Vegetarian", coverImageUrl: null, courses: [{ id: "course-1", label: "Seasonal vegetables", description: null }] }],
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
    if (design.name === "brand") {
      await expect(save).toHaveCSS("background-color", "rgb(36, 31, 27)");
      await expect(save).toHaveCSS("color", "rgb(255, 253, 249)");
      if (!testInfo.project.name.startsWith("mobile")) {
        await save.hover();
        await expect(save).toHaveCSS("background-color", "rgb(101, 74, 52)");
        await page.mouse.move(0, 0);
      }
    }
    const menu = page.locator('#menuSelect label:has(input[value="vegetarian"])');
    await menu.click();
    await expect(menu.locator("input")).toBeChecked();
    await expect(menu).not.toHaveCSS("box-shadow", "none");
    // Move focus using the keyboard so focus-visible is exercised on the label.
    await menu.locator("input").focus();
    await page.keyboard.press("ArrowLeft");
    const firstChoice = page.locator("#menuSelect label").first();
    await expect(firstChoice.locator("input")).toBeChecked();
    await expect(firstChoice).toHaveCSS("outline-style", "solid");
    await expect(firstChoice).toHaveCSS("outline-width", "3px");

    const decline = page.locator('label:has(input[name="rsvpStatus_0"][value="declined"])');
    await decline.click();
    await expect(decline.locator("input")).toBeChecked();
    await expect(decline).not.toHaveCSS("box-shadow", "none");
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
    await decline.locator("input").focus();
    await page.keyboard.press("Tab");
    await expect(save).toBeFocused();
    await expect(save).toHaveCSS("outline-style", "solid");
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
