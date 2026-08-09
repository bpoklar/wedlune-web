import { describe, expect, it } from "vitest";
import { hasMenuCourses } from "./rsvpMenu";

describe("RSVP menu presentation", () => {
  it("shows dishes when a menu contains courses", () => {
    expect(hasMenuCourses([{ id: "starter" }])).toBe(true);
  });

  it.each([undefined, null, []])(
    "uses the empty-menu note for %s courses",
    (courses) => {
      expect(hasMenuCourses(courses)).toBe(false);
    },
  );
});
