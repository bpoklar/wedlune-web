import { describe, expect, it } from "vitest";
import en from "../../i18n/locales/en.json";
import sl from "../../i18n/locales/sl.json";

function leafKeys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => leafKeys(item, `${prefix}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      leafKeys(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

describe("i18n catalogs", () => {
  it("keeps English and Slovenian message shapes identical", () => {
    expect(leafKeys(sl).sort()).toEqual(leafKeys(en).sort());
  });

  it("contains localized public-link error states", () => {
    expect(sl.rsvp.missingToken).toContain("žeton");
    expect(sl.gallery.missingToken).toContain("žeton");
    expect(sl.rsvp.missingToken).not.toBe(en.rsvp.missingToken);
    expect(sl.gallery.inactive).not.toBe(en.gallery.inactive);
  });

  it("describes the shared photography page as a shot list", () => {
    expect(en.gallery.notFoundTitle).toBe("Shot List Not Found");
    expect(en.gallery.missingToken).toContain("shot list link");
    expect(en.gallery.missingToken.toLowerCase()).not.toContain("gallery");
    expect(sl.gallery.notFoundTitle).toContain("Seznama posnetkov");
    expect(sl.gallery.missingToken).toContain("seznama posnetkov");
  });

  it("contains complete localized legal documents", () => {
    expect(sl.privacy.s2Items).toHaveLength(en.privacy.s2Items.length);
    expect(sl.terms.s5Items).toHaveLength(en.terms.s5Items.length);
    expect(sl.privacy.s13Title).toMatch(/^13\./);
    expect(sl.terms.s14Title).toMatch(/^14\./);
  });

  it("keeps the homepage compact in both locales", () => {
    for (const catalog of [en, sl]) {
      expect(catalog.home.proof.items).toHaveLength(4);
      expect(Object.keys(catalog.home.hero.slider.slides)).toHaveLength(7);
      expect(catalog.home.features.items).toHaveLength(6);
      expect(catalog.home.how.steps).toHaveLength(3);
      expect(catalog.home.faq.items).toHaveLength(6);
      expect(catalog.home).not.toHaveProperty("problem");
      expect(catalog.home).not.toHaveProperty("connected");
      expect(catalog.home).not.toHaveProperty("ai");
      expect(catalog.home).not.toHaveProperty("trust");
    }
  });

  it("uses outcome-led selling points in the proof strip", () => {
    expect(en.home.proof.items).toEqual([
      "Plan together",
      "Stay on budget",
      "RSVPs without the app",
      "Always know what's next",
    ]);
    expect(sl.home.proof.items).toEqual([
      "Načrtujta skupaj",
      "Ostanita znotraj proračuna",
      "RSVP brez aplikacije",
      "Vedno vesta, kaj sledi",
    ]);
  });
});
