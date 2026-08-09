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
