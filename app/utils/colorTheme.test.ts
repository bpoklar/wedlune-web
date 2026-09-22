import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { accessibleColor, contrastRatio, readableTextColor } from "./colorTheme";
import { createRsvpTheme, defaultRsvpDesign } from "./rsvpDesign";

describe("color accessibility", () => {
  it("handles middle luminance colors where dark gray and white both fail", () => {
    for (let channel = 0; channel <= 255; channel++) {
      const background = `#${channel.toString(16).padStart(2, "0").repeat(3)}`;
      expect(contrastRatio(readableTextColor(background), background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(accessibleColor("#C9A96E", background), background)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each([
    ["#FFFFFF", "#000000", "#777777"],
    ["#777777", "#FFFFFF", "#000000"],
    ["#FDF8F2", "#FDF8F2", "#FDF8F2"],
    ["#000000", "#FFFFFF", "#FFFFFF"],
  ])("keeps arbitrary custom surfaces readable (%s)", (accentColor, backgroundColor, surfaceColor) => {
    const theme = createRsvpTheme({ ...defaultRsvpDesign, colorMode: "custom", accentColor, backgroundColor, surfaceColor });
    for (const [foreground, background] of [
      ["text", "surface"], ["text-muted", "surface"], ["background-text", "background"],
      ["input-text", "input-surface"], ["input-secondary", "input-surface"],
      ["muted-text", "muted-surface"], ["muted-secondary", "muted-surface"],
      ["primary-text", "primary"], ["primary-hover-text", "primary-hover"],
      ["primary-pressed-text", "primary-pressed"], ["selection-text", "selection"],
    ]) {
      expect(contrastRatio(theme[`--rsvp-${foreground}`]!, theme[`--rsvp-${background}`]!)).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrastRatio(theme["--rsvp-input-border"]!, theme["--rsvp-input-surface"]!)).toBeGreaterThanOrEqual(3);
    expect(theme["--rsvp-primary"]).toBe(accentColor);
  });

  it("keeps UI palette literals out of page and component styles", () => {
    const root = new URL("../", import.meta.url);
    for (const directory of ["pages", "components", "layouts"]) {
      for (const file of readdirSync(new URL(`${directory}/`, root), { recursive: true })) {
        if (!String(file).endsWith(".vue")) continue;
        const source = readFileSync(new URL(`${directory}/${String(file).replaceAll("\\", "/")}`, root), "utf8");
        const styles = source.split("<style")[1] ?? "";
        expect(styles, `${directory}/${file}`).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(\s*\d/i);
      }
    }
  });
});
