import { describe, expect, it } from "vitest";

import {
  defaultRsvpDesign,
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
});
