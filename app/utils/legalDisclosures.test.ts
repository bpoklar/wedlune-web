import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "../../i18n/locales/en.json";
import sl from "../../i18n/locales/sl.json";

describe("AI and discovery legal disclosures", () => {
  it("documents one per-account consent for every covered AI feature", () => {
    for (const catalog of [en, sl]) {
      const privacy = catalog.privacy.s6Paragraphs.join(" ");
      expect(privacy).toMatch(/recommendations|priporočila/);
      expect(privacy).toMatch(/venue lookup|iskanje prizorišč/);
      expect(privacy).toMatch(/missing-task|manjkajočih opravil/);
      expect(privacy).toMatch(/per account|posamezen račun/);
      expect(privacy).toMatch(/partner|partnerja/);
      expect(privacy).toMatch(
        /deterministic timeline|deterministično ustvarjanje časovnice/,
      );
      expect(privacy).toMatch(/incomplete or incorrect|nepopolni ali napačni/);
    }
  });

  it("keeps data use, revocation, route, and accuracy details in one AI section", () => {
    for (const catalog of [en, sl]) {
      const paragraphs = catalog.privacy.s6Paragraphs;
      const privacy = paragraphs.join(" ");
      expect(paragraphs).toHaveLength(5);
      expect(privacy).toMatch(/guest-safe|brez zasebnih podatkov gostov/);
      expect(privacy).toMatch(/cannot make changes|ne morejo sami izvesti sprememb/);
      expect(privacy).toMatch(
        /Raw web-search excerpts|Surovi odlomki spletnega iskanja/,
      );
      expect(privacy).toMatch(/recommendation selections|izbire priporočil/);
      expect(privacy).toMatch(/follow-up responses|nadaljnja vprašanja/);
      expect(privacy).toContain("openrouteservice");
      expect(privacy).toMatch(/route coordinates|koordinate poti/);
      expect(privacy).toMatch(/Always review|Pred uporabo vedno preglejte/);
      expect(catalog.privacy.s11Body).toMatch(/Section 6|6\. razdelek/);
      expect(catalog.privacy.s11Body).not.toMatch(
        /recommendation selections|izbire priporočil/,
      );
    }
  });

  it("keeps processor details in the dedicated third-party section", () => {
    for (const catalog of [en, sl]) {
      const services = catalog.privacy.s7Items.join(" ");
      expect(services).toContain("Supabase");
      expect(services).toContain("RevenueCat");
      expect(services).toContain("OpenRouter");
      expect(services).toContain("Exa");
      expect(services).toContain("openrouteservice");
      expect(services).toContain("Google Gemini");
      expect(services).toMatch(/missing-task|manjkajočih opravil/);
    }
  });

  it("uses a compact privacy-notice disclosure instead of a terms link wall", () => {
    const privacyPage = readFileSync(
      new URL("../pages/privacy.vue", import.meta.url),
      "utf8",
    );
    expect(privacyPage).toContain("<details class=\"provider-notices\">");
    expect(privacyPage).toContain("https://supabase.com/privacy");
    expect(privacyPage).toContain("https://www.revenuecat.com/privacy/");
    expect(privacyPage).toContain("https://openrouter.ai/privacy");
    expect(privacyPage).toContain("https://exa.ai/privacy-policy");
    expect(privacyPage).toContain(
      "https://openrouteservice.org/privacy-policy/",
    );
    expect(privacyPage).not.toContain("https://openrouter.ai/terms");
    expect(privacyPage).not.toContain("data-processing-agreement");
    expect(privacyPage).not.toContain("anthropic.com/legal");
    expect(privacyPage).not.toContain("s6ConsentScope");
  });

  it("keeps legal dates and account deletion coverage synchronized", () => {
    expect(en.privacy.date).toBe("August 28, 2026");
    expect(en.terms.date).toBe("August 28, 2026");
    expect(sl.privacy.date).toBe("28. avgust 2026");
    expect(sl.terms.date).toBe("28. avgust 2026");
    for (const catalog of [en, sl]) {
      expect(catalog.deleteAccount.deletedBody).toMatch(
        /AI conversations|pogovore/,
      );
      expect(catalog.deleteAccount.deletedBody).toMatch(
        /consent records|zapise soglasja/,
      );
    }
  });

  it("discloses exact plan, RSVP, collaboration, and AI limits in both locales", () => {
    for (const catalog of [en, sl]) {
      const copy = [
        catalog.privacy.aiQuotaBody,
        catalog.privacy.rsvpPlanBody,
        catalog.terms.s2Body,
        catalog.terms.s7Body,
      ].join(" ");
      for (const value of ["10", "20", "50", "100", "24"]) {
        expect(copy).toContain(value);
      }
      expect(copy).toMatch(/two results|dvema rezultatoma/);
      expect(copy).toMatch(/three tasks|tremi opravili/);
      expect(copy).toMatch(/four results|štirimi rezultati/);
      expect(copy).toMatch(/five tasks|petimi opravili/);
      expect(copy.toLowerCase()).not.toMatch(/unlimited (ai|photo)|premium partner invitation/);
      expect(copy.toLowerCase()).not.toMatch(/neomejen(a|e|o|i) (ui|fotograf)|premium povabil/);
    }
  });

  it("does not make inaccurate AI privacy claims", () => {
    const privacy = en.privacy.s6Paragraphs.join(" ");
    expect(privacy).not.toContain("anonymous payload");
    expect(privacy).not.toContain("OpenRouter never receives");
    expect(privacy).not.toContain("no identifiers are sent");
    expect(privacy).not.toContain("exclude third-party display names");
  });
});
