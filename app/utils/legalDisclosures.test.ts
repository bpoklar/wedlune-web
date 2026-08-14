import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "../../i18n/locales/en.json";
import sl from "../../i18n/locales/sl.json";

describe("venue lookup legal disclosures", () => {
  it("describes OpenAI live Web Search and transient raw results in both locales", () => {
    for (const catalog of [en, sl]) {
      const privacy = catalog.privacy.s6Paragraphs.join(" ");
      expect(privacy).toContain("OpenAI Responses API");
      expect(privacy).toMatch(/Web Search|spletu/);
      expect(privacy).toContain("store:false");
      expect(privacy).toMatch(/raw search responses|surovih odgovorov/);
      expect(privacy).toContain("Gemini");
      expect(catalog.terms.s7Body).toContain("OpenAI Responses API");
      expect(catalog.terms.s7Body).toMatch(/clickable|klikljivimi/);
      expect(catalog.terms.s7Body).toContain("Gemini");
    }
  });

  it("links OpenAI and retained Google terms from both legal pages", () => {
    for (const page of ["privacy.vue", "terms.vue"]) {
      const source = readFileSync(
        new URL(`../pages/${page}`, import.meta.url),
        "utf8",
      );
      expect(source).toContain("https://openai.com/policies/services-agreement/");
      expect(source).toContain("https://openai.com/policies/privacy-policy/");
      expect(source).toContain("https://ai.google.dev/gemini-api/terms");
      expect(source).toContain("https://cloud.google.com/maps-platform/terms");
      expect(source).toContain("https://policies.google.com/privacy");
    }
  });
});
