import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { accessibleColor, contrastRatio, readableTextColor } from "./colorTheme";
import { createRsvpTheme, defaultRsvpDesign } from "./rsvpDesign";

describe("color accessibility", () => {
  const siteCss = readFileSync(new URL("../assets/css/main.css", import.meta.url), "utf8");
  function siteColor(role: string): string {
    const value = siteCss.match(new RegExp(`${role}:\\s*([^;]+)`))?.[1];
    if (!value) throw new Error(`Missing site color ${role}`);
    const alias = value.match(/^var\((--[\w-]+)\)$/)?.[1];
    return alias ? siteColor(alias) : value;
  }

  it("keeps brand text, actions, and control indicators readable", () => {
    for (const surface of ["--site-bg", "--site-surface"]) {
      for (const text of ["--site-text", "--site-text-muted", "--site-accent-strong"]) {
        expect(contrastRatio(siteColor(text), siteColor(surface)), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
      for (const indicator of ["--site-control-border", "--site-focus"]) {
        expect(contrastRatio(siteColor(indicator), siteColor(surface))).toBeGreaterThanOrEqual(3);
      }
    }
    for (const action of ["--site-action", "--site-action-hover", "--site-action-pressed"]) {
      expect(contrastRatio(siteColor("--site-on-action"), siteColor(action))).toBeGreaterThanOrEqual(4.5);
    }
    for (const text of ["--site-inverse-text", "--site-inverse-muted", "--site-accent"]) {
      expect(contrastRatio(siteColor(text), siteColor("--site-surface-strong"))).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("defines every site role consumed by component and page styles", () => {
    const root = new URL("../", import.meta.url);
    const declared = new Set([...siteCss.matchAll(/(--site-[\w-]+):/g)].map((match) => match[1]));
    for (const directory of ["pages", "components", "layouts"]) {
      for (const file of readdirSync(new URL(`${directory}/`, root), { recursive: true })) {
        if (!String(file).endsWith(".vue")) continue;
        const source = readFileSync(new URL(`${directory}/${String(file).replaceAll("\\", "/")}`, root), "utf8");
        for (const match of source.matchAll(/var\((--site-[\w-]+)/g)) {
          expect(declared.has(match[1]!), `${directory}/${file}: ${match[1]}`).toBe(true);
        }
        expect(source, `${directory}/${file}`).not.toContain("--color-soft-champagne");
        expect(source, `${directory}/${file}: display glyph encoding`).not.toMatch(/\u00e2[\u20ac\u2020\u0153]|\uFFFD/);
      }
    }
  });

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
