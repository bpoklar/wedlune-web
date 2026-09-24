import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "../../i18n/locales/en.json";
import italian from "../../i18n/locales/it.json";
import sl from "../../i18n/locales/sl.json";

describe("AI and discovery legal disclosures", () => {
  it("documents one per-account consent for every covered AI feature", () => {
    for (const catalog of [en, sl, italian]) {
      const privacy = catalog.privacy.s6Paragraphs.join(" ");
      expect(privacy).toMatch(/recommendations|priporočila|suggerimenti/);
      expect(privacy).toMatch(/venue lookup|iskanje prizorišč|ricerca di location/);
      expect(privacy).toMatch(/missing-task|manjkajočih opravil|attività mancanti/);
      expect(privacy).toMatch(/per account|posamezen račun/);
      expect(privacy).toMatch(/partner|partnerja/);
      expect(privacy).toMatch(
        /deterministic timeline|deterministično ustvarjanje časovnice|generazione deterministica della cronologia/,
      );
      expect(privacy).toMatch(/incomplete or incorrect|nepopolni ali napačni|incompleti o errati/);
    }
  });

  it("keeps data use, revocation, route, and accuracy details in one AI section", () => {
    for (const catalog of [en, sl, italian]) {
      const paragraphs = catalog.privacy.s6Paragraphs;
      const privacy = paragraphs.join(" ");
      expect(paragraphs).toHaveLength(5);
      expect(privacy).toMatch(/guest-safe|brez zasebnih podatkov gostov|privi di dati privati degli invitati/);
      expect(privacy).toMatch(/cannot make changes|ne morejo sami izvesti sprememb|non possono apportare modifiche/);
      expect(privacy).toMatch(
        /Raw web-search excerpts|Surovi odlomki spletnega iskanja|estratti grezzi delle ricerche web/,
      );
      expect(privacy).toMatch(/recommendation selections|izbire priporočil|selezioni dei suggerimenti/);
      expect(privacy).toMatch(/follow-up responses|nadaljnja vprašanja|risposte di approfondimento/);
      expect(privacy).toContain("openrouteservice");
      expect(privacy).toMatch(/route coordinates|koordinate poti|coordinate dei percorsi/);
      expect(privacy).toMatch(/Always review|Pred uporabo vedno preglejte|Esaminare e verificare sempre/);
      expect(catalog.privacy.s11Body).toMatch(/Section 6|6\. razdelek|sezione 6/);
      expect(catalog.privacy.s11Body).not.toMatch(
        /recommendation selections|izbire priporočil|selezioni dei suggerimenti/,
      );
    }
  });

  it("keeps processor details in the dedicated third-party section", () => {
    for (const catalog of [en, sl, italian]) {
      const services = catalog.privacy.s7Items.join(" ");
      expect(services).toContain("Supabase");
      expect(services).toContain("RevenueCat");
      expect(services).toContain("Cloudflare");
      expect(services).toContain("Apple App Store");
      expect(services).toContain("OpenRouter");
      expect(services).toContain("Exa");
      expect(services).toContain("openrouteservice");
      expect(services).toContain("Google Gemini");
      expect(services).toMatch(/missing-task|manjkajočih opravil|attività mancanti/);
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
    expect(privacyPage).toContain("https://www.cloudflare.com/privacypolicy/");
    expect(privacyPage).toContain("https://www.apple.com/legal/privacy/");
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
    expect(italian.privacy.date).toBe("2 settembre 2026");
    expect(italian.terms.date).toBe("2 settembre 2026");
    expect(italian.deleteAccount.date).toBe("2 settembre 2026");
    expect(en.privacy.date).toBe("September 2, 2026");
    expect(en.terms.date).toBe("September 2, 2026");
    expect(en.deleteAccount.date).toBe("September 2, 2026");
    expect(sl.privacy.date).toBe("2. september 2026");
    expect(sl.terms.date).toBe("2. september 2026");
    expect(sl.deleteAccount.date).toBe("2. september 2026");
    for (const catalog of [en, sl, italian]) {
      expect(catalog.deleteAccount.deletedBody).toMatch(
        /private AI data|zasebne podatke.*UI|dati IA privati/,
      );
      expect(catalog.deleteAccount.deletedBody).toMatch(
        /consent records|zapise soglasja|registrazioni del consenso/,
      );
      expect(catalog.deleteAccount.deletedBody).toMatch(
        /partner remains|partner ostane|rimane un partner/,
      );
      expect(catalog.deleteAccount.retainedBody).toContain("Apple App Store");
    }
  });

  it("explains store billing and shared-plan deletion consistently", () => {
    for (const catalog of [en, sl, italian]) {
      expect(catalog.terms.s9Body).toContain("Apple App Store");
      expect(catalog.terms.s9Body).toMatch(/automatically|samodejno|automaticamente/);
      expect(catalog.terms.s9Body).toMatch(/uninstalling|odstranitev|disinstallare/);
      expect(catalog.privacy.s10After).toMatch(/partner remains|partner ostane|rimane un partner/);
      expect(catalog.privacy.s10After).toMatch(
        /not transferred|se ne prenesejo|non vengono trasferiti/,
      );
    }
  });

  it("discloses exact plan, RSVP, collaboration, and AI limits in both locales", () => {
    for (const catalog of [en, sl, italian]) {
      const copy = [
        catalog.privacy.aiQuotaBody,
        catalog.privacy.rsvpPlanBody,
        catalog.terms.s2Body,
        catalog.terms.s7Body,
      ].join(" ");
      for (const value of ["10", "20", "50", "100", "24"]) {
        expect(copy).toContain(value);
      }
      expect(copy).toMatch(/two results|dvema rezultatoma|due risultati/);
      expect(copy).toMatch(/three tasks|tremi opravili|tre attività/);
      expect(copy).toMatch(/four results|štirimi rezultati|quattro risultati/);
      expect(copy).toMatch(/five tasks|petimi opravili|cinque attività/);
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
