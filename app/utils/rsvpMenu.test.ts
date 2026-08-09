import { describe, expect, it } from "vitest";
import { hasMenuCourses } from "./rsvpMenu";

describe("RSVP menu presentation", () => {
  it("shows dishes when a menu contains courses", () => {
    expect(hasMenuCourses([{ id: "starter" }])).toBe(true);
  });

  for (const [label, courses] of [
    ["undefined", undefined],
    ["null", null],
    ["empty", []],
  ] as const) {
    it(`uses the empty-menu note for ${label} courses`, () => {
      expect(hasMenuCourses(courses)).toBe(false);
    });
  }
});
