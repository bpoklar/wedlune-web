import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "../../i18n/locales/en.json";
import sl from "../../i18n/locales/sl.json";

describe("venue lookup legal disclosures", () => {
  it("describes transient Gemini Search and URL Context in both locales", () => {
    for (const catalog of [en, sl]) {
      expect(catalog.privacy.s6Paragraphs.join(" ")).toContain("Google");
      expect(catalog.privacy.s6Paragraphs.join(" ")).toMatch(/Search|Iskanj/);
      expect(catalog.privacy.s6Paragraphs.join(" ")).toContain(
        "Gemini URL Context",
      );
      expect(catalog.privacy.s6Paragraphs.join(" ")).not.toContain("Google Places");
      expect(catalog.terms.s7Body).toContain("Google");
      expect(catalog.terms.s7Body).toContain("Gemini URL Context");
    }
  });

  it("links Google terms and privacy from both legal pages", () => {
    for (const page of ["privacy.vue", "terms.vue"]) {
      const source = readFileSync(new URL(`../pages/${page}`, import.meta.url), "utf8");
      expect(source).toContain("https://ai.google.dev/gemini-api/terms");
      expect(source).toContain("https://cloud.google.com/maps-platform/terms");
      expect(source).toContain("https://policies.google.com/privacy");
    }
  });
});
