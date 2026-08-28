import { describe, expect, it } from "vitest";
import en from "../../i18n/locales/en.json";
import sl from "../../i18n/locales/sl.json";
import {
  featuredComparisonRowIds,
  featuredComparisonRows,
  planComparisonGroups,
  planComparisonRows,
  type PlanComparisonRow,
} from "./planComparison";

const byId = (id: string): PlanComparisonRow => {
  const comparisonRow = planComparisonRows.find((item) => item.id === id);
  if (!comparisonRow) throw new Error(`Missing comparison row: ${id}`);
  return comparisonRow;
};

const getMessage = (catalog: unknown, key: string): unknown =>
  key.split(".").reduce<unknown>((value, segment) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[segment];
  }, catalog);

describe("plan comparison", () => {
  it("has stable groups, unique rows, and complete bilingual messages", () => {
    expect(planComparisonGroups.map((group) => group.id)).toEqual([
      "core",
      "lists",
      "guests",
      "collaboration",
      "recommendations",
    ]);

    const rowIds = planComparisonRows.map((comparisonRow) => comparisonRow.id);
    expect(new Set(rowIds).size).toBe(rowIds.length);
    expect(rowIds).toHaveLength(34);

    for (const group of planComparisonGroups) {
      expect(getMessage(en, group.titleKey)).toEqual(expect.any(String));
      expect(getMessage(sl, group.titleKey)).toEqual(expect.any(String));
    }

    for (const comparisonRow of planComparisonRows) {
      for (const key of [
        comparisonRow.labelKey,
        comparisonRow.free.labelKey,
        comparisonRow.premium.labelKey,
      ]) {
        expect(getMessage(en, key), `Missing English message: ${key}`).toEqual(expect.any(String));
        expect(getMessage(sl, key), `Missing Slovenian message: ${key}`).toEqual(expect.any(String));
      }
    }
  });

  it("matches the shipped Free limits instead of stale documentation", () => {
    expect(byId("guests").free.limit).toBe(50);
    expect(byId("venues").free.limit).toBe(3);
    expect(byId("vendors").free.limit).toBe(10);
    expect(byId("caterers").free.limit).toBe(5);
    expect(byId("attire").free.limit).toBe(20);
    expect(byId("transport").free.limit).toBe(5);
    expect(byId("gallery").free.limit).toBe(20);
    expect(byId("gallery").premium.limit).toBe(100);
    expect(byId("venueLookups").free.limit).toBe(2);
    expect(byId("recommendationGenerations").free.limit).toBe(1);
    expect(byId("recommendationResults").free.limit).toBe(2);
    expect(byId("recommendationResults").premium.limit).toBe(4);
    expect(byId("missingTaskScan").free.limit).toBe(1);
    expect(byId("recommendationGenerations").premium.limit).toBe(10);
    expect(byId("missingTaskScan").premium.limit).toBe(5);
    expect(byId("venueLookups").premium.limit).toBe(20);
    expect(byId("aiChat").premium.limit).toBe(100);
    expect(byId("partnerCollaboration").free.state).toBe("included");
    expect(byId("manualSeating").free.state).toBe("included");
    expect(byId("rsvpWebsite").free.limit).toBe(50);

    const comparisonCopy = JSON.stringify({ en: en.home.pricing, sl: sl.home.pricing });
    expect(comparisonCopy).not.toMatch(/unlimited (AI|photo)|neomejen(a|e|o|i) (UI|fotograf)/i);
  });

  it("keeps AI-specific capabilities in the final group", () => {
    expect(planComparisonGroups.at(-1)?.id).toBe("recommendations");
    expect(planComparisonGroups.at(-1)?.rows.map((item) => item.id)).toEqual([
      "recommendationGenerations",
      "recommendationResults",
      "missingTaskScan",
      "venueLookups",
      "aiChat",
      "moreLikeThis",
      "shortlistComparison",
      "followupQuestions",
    ]);
  });

  it("keeps the compact overview focused on six meaningful differences", () => {
    expect(featuredComparisonRowIds).toEqual([
      "guests",
      "partnerCollaboration",
      "rsvpWebsite",
      "seatingChart",
      "pdfExports",
      "advertising",
    ]);
    expect(featuredComparisonRows.map((comparisonRow) => comparisonRow.id)).toEqual([
      ...featuredComparisonRowIds,
    ]);
    expect(new Set(featuredComparisonRowIds).size).toBe(6);
  });

  it("leaves monetary pricing to the platform stores", () => {
    const comparisonCopy = JSON.stringify({ en: en.home.pricing, sl: sl.home.pricing });
    expect(comparisonCopy).not.toMatch(/[$€£]|9[.,]99|69[.,]99/);
    expect(en.home.pricing.storeNote).toContain("App Store");
    expect(sl.home.pricing.storeNote).toContain("Google Play");
  });
});
