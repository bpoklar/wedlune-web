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

  it("describes aggregate-only AI chat separately in both locales", () => {
    for (const catalog of [en, sl]) {
      const privacy = catalog.privacy.s6Paragraphs.join(" ");
      const transfers = catalog.privacy.s4Paragraphs.join(" ");
      const use = catalog.privacy.s3Paragraphs.join(" ");
      expect(privacy).toContain("OpenRouter");
      expect(privacy).toContain("Auto Router");
      expect(privacy).toMatch(/does not apply a model-family allowlist|ne uporablja seznama dovoljenih družin modelov/);
      expect(privacy).toMatch(/aggregate|zbirn/);
      expect(privacy).toMatch(/pseudonymous|psevdonim/);
      expect(privacy).toMatch(/Zero Data Retention|brez hrambe podatkov/);
      expect(privacy).toMatch(/in-memory|pomnilniku/);
      expect(transfers).toMatch(/outside the EEA|zunaj EGP/);
      expect(privacy).toMatch(/delete all chats|vseh klepetov/);
      expect(privacy).toMatch(/action proposal|predlog dejanja/);
      expect(privacy).toMatch(/cannot execute|ne more izvesti/);
      expect(privacy).toMatch(/selected target|izbrani cilj/i);
      expect(privacy).toMatch(/locally|lokalno/);
      expect(privacy).toMatch(/draft|osnut/);
      expect(privacy).toMatch(/never claims|nikoli ne prevzame/);
      expect(privacy).toMatch(/does not delete existing history|ne izbriše obstoječe zgodovine/);
      expect(use).toMatch(/explicit versioned consent|izrecno soglasje/);
      expect(catalog.terms.s7Body).toMatch(/aggregate|zbirn/);
      expect(catalog.terms.s7Body).toMatch(/confirm|potrdit/);
      expect(catalog.terms.s7Body).toContain("20");
      expect(catalog.terms.s7Body).toContain("OpenAI Responses API");
      expect(catalog.terms.s7Body).toContain("Gemini");
    }
  });

  it("keeps legal dates and account deletion coverage synchronized", () => {
    expect(en.privacy.date).toBe("August 17, 2026");
    expect(en.terms.date).toBe("August 17, 2026");
    expect(sl.privacy.date).toBe("17. avgust 2026");
    expect(sl.terms.date).toBe("17. avgust 2026");
    for (const catalog of [en, sl]) {
      expect(catalog.deleteAccount.deletedBody).toMatch(
        /AI conversations|pogovore/,
      );
      expect(catalog.deleteAccount.deletedBody).toMatch(
        /consent records|zapise soglasja/,
      );
    }
  });

  it("does not make inaccurate aggregate-chat privacy claims", () => {
    const privacy = en.privacy.s6Paragraphs.join(" ");
    expect(privacy).not.toContain("anonymous payload");
    expect(privacy).not.toContain("OpenRouter never receives");
    expect(privacy).not.toContain("no identifiers are sent");
    expect(privacy).toContain("different data flows");
  });

  it("links every AI provider notice from both legal pages", () => {
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
      expect(source).toContain("https://openrouter.ai/terms");
      expect(source).toContain("https://openrouter.ai/privacy");
      expect(source).toContain(
        "https://openrouter.ai/data-processing-agreement",
      );
      expect(source).toContain(
        "https://openrouter.ai/docs/guides/privacy/provider-logging/",
      );
      expect(source).toContain(
        "https://www.anthropic.com/legal/commercial-terms",
      );
      expect(source).toContain("https://www.anthropic.com/legal/privacy");
    }
  });
});
