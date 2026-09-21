import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import {
  defaultRsvpDesign,
  createHeroImageStyle,
  createRsvpTheme,
  readableTextColor,
  resolveRsvpDesign,
} from "./rsvpDesign";

describe("RSVP design contract", () => {
  it("falls back for missing or unsafe designs", () => {
    expect(resolveRsvpDesign(null)).toEqual(defaultRsvpDesign);
    expect(resolveRsvpDesign({
      ...defaultRsvpDesign,
      accentColor: "red; background:url(x)",
    })).toEqual(defaultRsvpDesign);
  });

  it.each(["classic", "botanical", "modern"] as const)(
    "accepts the %s template",
    (template) => {
      expect(resolveRsvpDesign({ ...defaultRsvpDesign, template }).template)
        .toBe(template);
    },
  );

  it("derives readable foreground colors", () => {
    expect(readableTextColor("#FFFFFF")).toBe("#111827");
    expect(readableTextColor("#111111")).toBe("#FFFFFF");
  });

  it("defaults framing for older version-1 payloads", () => {
    const oldDesign = { ...defaultRsvpDesign } as Record<string, unknown>;
    delete oldDesign.heroImageFocalX;
    delete oldDesign.heroImageFocalY;
    delete oldDesign.heroImageZoom;

    expect(resolveRsvpDesign(oldDesign)).toMatchObject({
      heroImageFocalX: 0.5,
      heroImageFocalY: 0.5,
      heroImageZoom: 1,
    });
  });

  it("preserves valid framing and creates matching image styles", () => {
    const design = resolveRsvpDesign({
      ...defaultRsvpDesign,
      heroImageFocalX: 0.25,
      heroImageFocalY: 0.8,
      heroImageZoom: 2.2,
    });

    expect(createHeroImageStyle(design)).toEqual({
      objectPosition: "25% 80%",
      transform: "scale(2.2)",
      transformOrigin: "25% 80%",
    });
  });

  it("falls back when framing is out of range or not finite", () => {
    expect(resolveRsvpDesign({
      ...defaultRsvpDesign,
      heroImageZoom: 3.1,
    })).toEqual(defaultRsvpDesign);
    expect(resolveRsvpDesign({
      ...defaultRsvpDesign,
      heroImageFocalX: Number.NaN,
    })).toEqual(defaultRsvpDesign);
    expect(resolveRsvpDesign({
      ...defaultRsvpDesign,
      heroImageFocalY: null,
    })).toEqual(defaultRsvpDesign);
  });

  it("keeps every public template crop ratio deterministic", () => {
    const page = readFileSync(
      new URL("../pages/rsvp.vue", import.meta.url),
      "utf8",
    );

    expect(page).toContain(".rsvp-hero-frame {\n  aspect-ratio: 16 / 9;");
    expect(page).toContain(".rsvp-template-botanical .rsvp-hero-frame {\n  aspect-ratio: 4 / 3;");
    expect(page).toContain(".rsvp-template-modern .rsvp-hero-frame {\n  aspect-ratio: 4 / 3;");
    expect(page).toContain("grid-row: 1 / span 3;\n    aspect-ratio: 6 / 5;");
  });

  it("keeps custom design values while deriving palette-safe surfaces", () => {
    const design = resolveRsvpDesign({
      ...defaultRsvpDesign,
      template: "modern",
      accentColor: "#F2C94C",
      backgroundColor: "#101820",
      surfaceColor: "#17212B",
      heroImageUrl: "https://example.com/hero.jpg",
      invitationHeading: "  Celebrate with us  ",
      welcomeMessage: "A custom welcome",
      confirmationMessage: "A custom confirmation",
    });
    const theme = createRsvpTheme(design);

    expect(design).toMatchObject({
      template: "modern",
      accentColor: "#F2C94C",
      backgroundColor: "#101820",
      surfaceColor: "#17212B",
      heroImageUrl: "https://example.com/hero.jpg",
      invitationHeading: "Celebrate with us",
      welcomeMessage: "A custom welcome",
      confirmationMessage: "A custom confirmation",
    });
    expect(theme["--rsvp-background"]).toBe("#101820");
    expect(theme["--rsvp-surface"]).toBe("#17212B");
    expect(theme["--rsvp-text"]).toBe("#FFFFFF");
    expect(theme["--rsvp-input-text"]).toBe("#FFFFFF");
  });

  it("derives readable roles for a light custom palette", () => {
    const theme = createRsvpTheme({
      ...defaultRsvpDesign,
      accentColor: "#8A5A44",
      backgroundColor: "#FFF9F4",
      surfaceColor: "#FFFFFF",
    });

    expect(theme["--rsvp-text"]).toBe("#111827");
    expect(theme["--rsvp-muted-text"]).toBe("#111827");
    expect(theme["--rsvp-input-text"]).toBe("#111827");
  });
});

describe("RSVP interaction colors", () => {
  const siteCss = readFileSync(new URL("../assets/css/main.css", import.meta.url), "utf8");
  function color(value: string): string {
    const token = value.match(/^var\((--[\w-]+)\)$/)?.[1];
    if (!token) return value;
    const resolved = siteCss.match(new RegExp(`${token}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
    if (!resolved) throw new Error(`Missing site color ${token}`);
    return resolved;
  }
  function luminance(value: string) {
    const channels = color(value).slice(1).match(/../g)!.map((part) => {
      const channel = parseInt(part, 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
  }
  function contrast(first: string, second: string) {
    const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (values[0]! + 0.05) / (values[1]! + 0.05);
  }

  it("uses the shared site colors for existing default designs", () => {
    const theme = createRsvpTheme(defaultRsvpDesign);
    expect(theme["--rsvp-primary"]).toBe("var(--site-surface-strong)");
    expect(theme["--rsvp-accent"]).toBe("var(--site-accent)");
    expect(theme["--rsvp-primary-hover"]).toBe("var(--site-accent-strong)");
    expect(defaultRsvpDesign.accentColor).toBe("#B88A4A");
  });

  it.each([
    ["default", defaultRsvpDesign],
    ["dark", { ...defaultRsvpDesign, accentColor: "#F2C94C", backgroundColor: "#101820", surfaceColor: "#17212B" }],
    ["light", { ...defaultRsvpDesign, accentColor: "#DFC4CE", backgroundColor: "#FFF9F4", surfaceColor: "#FFFFFF" }],
    ["dark accent on dark surface", { ...defaultRsvpDesign, accentColor: "#243746", backgroundColor: "#101820", surfaceColor: "#17212B" }],
  ])("keeps %s interaction text and focus indicators readable", (_name, design) => {
    const theme = createRsvpTheme(design as typeof defaultRsvpDesign);
    for (const [foreground, background] of [
      ["--rsvp-primary-text", "--rsvp-primary"],
      ["--rsvp-primary-hover-text", "--rsvp-primary-hover"],
      ["--rsvp-selection-text", "--rsvp-selection"],
      ["--rsvp-accepted-text", "--rsvp-accepted-surface"],
    ] as const) {
      expect(contrast(theme[foreground], theme[background])).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(theme["--rsvp-focus"], theme["--rsvp-surface"])).toBeGreaterThanOrEqual(3);
    if (_name !== "default") {
      expect(theme["--rsvp-accent"]).toBe((design as typeof defaultRsvpDesign).accentColor);
    }
  });
});
