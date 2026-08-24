import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "../../i18n/locales/en.json";
import sl from "../../i18n/locales/sl.json";

describe("AI and discovery legal disclosures", () => {
  it("describes source-bound discovery without overstating provider retention", () => {
    for (const catalog of [en, sl]) {
      const privacy = catalog.privacy.s6Paragraphs.join(" ");
      expect(privacy).toContain("OpenRouter");
      expect(privacy).toContain("Exa");
      expect(privacy).toMatch(/source-bound|vezano na vire/);
      expect(privacy).toMatch(
        /does not persist raw search excerpts|ne shranjuje surovih odlomkov/,
      );
      expect(privacy).toMatch(/applicable agreements|veljavnimi pogodbami/);
      expect(privacy).toContain("openrouteservice");
      expect(privacy).toMatch(/route coordinates|koordinate poti/);
      expect(catalog.terms.s7Body).toContain("Exa");
      expect(catalog.terms.s7Body).toContain("openrouteservice");
    }
  });

  it("describes guest-safe AI chat with saved business details in both locales", () => {
    for (const catalog of [en, sl]) {
      const privacy = catalog.privacy.s6Paragraphs.join(" ");
      const transfers = catalog.privacy.s4Paragraphs.join(" ");
      const use = catalog.privacy.s3Paragraphs.join(" ");
      expect(privacy).toContain("OpenRouter");
      expect(privacy).toContain("Auto Router");
      expect(privacy).toMatch(/does not apply a model-family allowlist|ne uporablja seznama dovoljenih družin modelov/);
      expect(privacy).toMatch(/guest-safe|brez zasebnih podatkov gostov/);
      expect(privacy).toMatch(/saved business details|shranjeni poslovni podatki/i);
      expect(privacy).toMatch(/venue names|imena in vrste prizorišč/);
      expect(privacy).toMatch(/business contact names|poslovnih kontaktnih oseb/);
      expect(privacy).toMatch(/At most 20|največ 20/);
      expect(privacy).toMatch(/Guest and couple names|Imena, kontakti in opombe gostov ali para/);
      expect(privacy).toMatch(/per-record prices|cene posameznih zapisov/);
      expect(privacy).toMatch(/Manually typed|Ročno vneseni/);
      expect(privacy).toMatch(/pseudonymous|psevdonim/);
      expect(privacy).toMatch(/Zero Data Retention|brez hrambe podatkov/);
      expect(privacy).toMatch(/in-memory|pomnilniku/);
      expect(transfers).toMatch(/outside the EEA|zunaj EGP/);
      expect(catalog.privacy.s11Body).toMatch(/all chats|vse klepete/);
      expect(privacy).toMatch(/action proposal|predlog dejanja/);
      expect(privacy).toMatch(/cannot execute|ne more izvesti/);
      expect(privacy).toMatch(/selected target|izbrani cilj/i);
      expect(privacy).toMatch(/locally|lokalno/);
      expect(privacy).toMatch(/draft|osnut/);
      expect(privacy).toMatch(/never claims|nikoli ne prevzame/);
      expect(privacy).toMatch(/atomically|atomsko/);
      expect(privacy).toMatch(/feedback|povratne informacije/);
      expect(use).toMatch(/explicit versioned consent|izrecno soglasje/);
      expect(use).toMatch(
        /recommendation-discovery and transport-routing|odkrivanja priporočil in prevoznih poti/,
      );
      expect(catalog.terms.s7Body).toMatch(/guest-safe|brez zasebnih podatkov gostov/);
      expect(catalog.terms.s7Body).toMatch(/saved business details|shranjenih poslovnih podatkov/);
      expect(catalog.terms.s7Body).toMatch(/confirm|potrdit/);
      expect(catalog.terms.s7Body).toContain("20");
      expect(catalog.terms.s7Body).toContain("Exa");
      expect(catalog.terms.s7Body).toContain("openrouteservice");
    }
  });

  it("keeps legal dates and account deletion coverage synchronized", () => {
    expect(en.privacy.date).toBe("August 24, 2026");
    expect(en.terms.date).toBe("August 24, 2026");
    expect(sl.privacy.date).toBe("24. avgust 2026");
    expect(sl.terms.date).toBe("24. avgust 2026");
    for (const catalog of [en, sl]) {
      expect(catalog.deleteAccount.deletedBody).toMatch(
        /AI conversations|pogovore/,
      );
      expect(catalog.deleteAccount.deletedBody).toMatch(
        /consent records|zapise soglasja/,
      );
    }
  });

  it("does not make inaccurate AI chat privacy claims", () => {
    const privacy = en.privacy.s6Paragraphs.join(" ");
    expect(privacy).not.toContain("anonymous payload");
    expect(privacy).not.toContain("OpenRouter never receives");
    expect(privacy).not.toContain("no identifiers are sent");
    expect(privacy).not.toContain("exclude third-party display names");
    expect(privacy).not.toContain("OpenAI Responses API");
    expect(privacy).not.toContain("Gemini Google Maps grounding");
  });

  it("links every AI provider notice from both legal pages", () => {
    for (const page of ["privacy.vue", "terms.vue"]) {
      const source = readFileSync(
        new URL(`../pages/${page}`, import.meta.url),
        "utf8",
      );
      expect(source).toContain("https://ai.google.dev/gemini-api/terms");
      expect(source).toContain("https://exa.ai/privacy-policy");
      expect(source).toContain("https://openrouteservice.org/terms-of-service/");
      expect(source).toContain("https://openrouteservice.org/privacy-policy/");
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
      expect(source).not.toContain("https://openai.com/policies/");
      expect(source).not.toContain("https://cloud.google.com/maps-platform/");
    }
  });
});
