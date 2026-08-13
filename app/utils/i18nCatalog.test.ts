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

  it("contains complete localized legal documents", () => {
    expect(sl.privacy.s2Items).toHaveLength(en.privacy.s2Items.length);
    expect(sl.terms.s5Items).toHaveLength(en.terms.s5Items.length);
    expect(sl.privacy.s13Title).toMatch(/^13\./);
    expect(sl.terms.s14Title).toMatch(/^14\./);
  });

  it("keeps the homepage compact in both locales", () => {
    for (const catalog of [en, sl]) {
      expect(catalog.home.proof.items).toHaveLength(4);
      expect(catalog.home.features.items).toHaveLength(6);
      expect(catalog.home.how.steps).toHaveLength(3);
      expect(catalog.home.faq.items).toHaveLength(6);
      expect(catalog.home).not.toHaveProperty("problem");
      expect(catalog.home).not.toHaveProperty("connected");
      expect(catalog.home).not.toHaveProperty("ai");
      expect(catalog.home).not.toHaveProperty("trust");
    }
  });
});
