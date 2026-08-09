import { describe, expect, it } from "vitest";

import {
  defaultRsvpDesign,
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
