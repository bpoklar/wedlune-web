import { readFileSync } from "node:fs";
import { createI18n } from "vue-i18n";
import { describe, expect, it } from "vitest";
import en from "../../i18n/locales/en.json";
import italian from "../../i18n/locales/it.json";
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
  it("keeps all three languages’ message shapes identical", () => {
    for (const catalog of [sl, italian]) expect(leafKeys(catalog).sort()).toEqual(leafKeys(en).sort());
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
    for (const catalog of [en, sl, italian]) {
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

function leaves(value: unknown, prefix = ""): Record<string, string> {
  if (value && typeof value === "object") return Object.assign({}, ...Object.entries(value).map(([key, child]) => leaves(child, `${prefix}.${key}`)));
  return { [prefix]: String(value) };
}

it("preserves every interpolation and rejects duplicate JSON properties", () => {
  const source = leaves(en);
  for (const [code, catalog] of Object.entries({en, sl, it: italian})) {
    const counts: Record<string, number> = {};
    const visit = (value: unknown) => {
      if (!value || typeof value !== "object") return;
      for (const [key, child] of Object.entries(value)) {
        if (!Array.isArray(value)) counts[key] = (counts[key] ?? 0) + 1;
        visit(child);
      }
    };
    visit(catalog);
    const raw = readFileSync(new URL(`../../i18n/locales/${code}.json`, import.meta.url), "utf8");
    const rawCounts: Record<string, number> = {};
    for (const match of raw.matchAll(/"((?:[^"\\]|\\.)*)"\s*:/g)) {
      const key = JSON.parse(`"${match[1]}"`);
      rawCounts[key] = (rawCounts[key] ?? 0) + 1;
    }
    expect(rawCounts).toEqual(counts);
    for (const [key, value] of Object.entries(leaves(catalog))) {
      expect(value.trim(), `${code}:${key}`).not.toBe("");
      const params = (text: string) => [...new Set([...text.matchAll(/\{(\w+)\}/g)].map(m => m[1]))].sort();
      expect(params(value), `${code}:${key}`).toEqual(params(source[key]!));
    }
  }
});

it("renders Italian shot counts in singular and plural", () => {
  const { t } = createI18n({legacy: false, locale: "it", messages: {it: italian}}).global;
  expect(t("gallery.shotCount", {count: 1})).toBe("1 scatto");
  expect(t("gallery.shotCount", {count: 2})).toBe("2 scatti");
});
