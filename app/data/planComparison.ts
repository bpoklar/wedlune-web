export type PlanComparisonValueState =
  | "included"
  | "unavailable"
  | "limited"
  | "premium";

export interface PlanComparisonValue {
  labelKey: string;
  state: PlanComparisonValueState;
  limit?: number;
}

export interface PlanComparisonRow {
  id: string;
  labelKey: string;
  free: PlanComparisonValue;
  premium: PlanComparisonValue;
}

export interface PlanComparisonGroup {
  id: string;
  titleKey: string;
  rows: PlanComparisonRow[];
}

const value = (
  id: string,
  state: PlanComparisonValueState,
  limit?: number,
): PlanComparisonValue => ({
  labelKey: `home.pricing.values.${id}`,
  state,
  ...(limit === undefined ? {} : { limit }),
});

const included = () => value("included", "included");
const unavailable = () => value("notIncluded", "unavailable");
const premium = () => value("included", "premium");
const unlimited = () => value("unlimited", "premium");

const row = (
  id: string,
  free: PlanComparisonValue,
  premiumValue: PlanComparisonValue,
): PlanComparisonRow => ({
  id,
  labelKey: `home.pricing.features.${id}`,
  free,
  premium: premiumValue,
});

/**
 * Public plan comparison values mirror the shipped Flutter entitlements in:
 * ../wedlune/lib/features/settings/providers/feature_limits_provider.dart
 *
 * Online venue lookup usage is also enforced server-side at two Free lookups in:
 * ../wedlune/supabase/migrations/20260811173000_edge_function_atomic_workflows.sql
 *
 * Keep this list user-facing: do not expose model names, API rate limits,
 * cache behavior, grounding scope, or unshipped monetization ideas here.
 */
export const planComparisonGroups: PlanComparisonGroup[] = [
  {
    id: "core",
    titleKey: "home.pricing.groups.core",
    rows: [
      row("profile", included(), included()),
      row("timeline", included(), included()),
      row("budget", included(), included()),
      row("legalDocuments", included(), included()),
      row("basicNotifications", included(), included()),
      row("monthCalendar", unavailable(), premium()),
      row("advancedNotifications", unavailable(), premium()),
    ],
  },
  {
    id: "lists",
    titleKey: "home.pricing.groups.lists",
    rows: [
      row("guests", value("guests25", "limited", 25), unlimited()),
      row("venues", value("venues1", "limited", 1), unlimited()),
      row("vendors", value("vendors3", "limited", 3), unlimited()),
      row("caterers", value("caterers3", "limited", 3), unlimited()),
      row("attire", value("attire10", "limited", 10), unlimited()),
      row("transport", value("transport3", "limited", 3), unlimited()),
      row("gallery", value("gallery10", "limited", 10), unlimited()),
    ],
  },
  {
    id: "guests",
    titleKey: "home.pricing.groups.guests",
    rows: [
      row("rsvpWebsite", unavailable(), premium()),
      row("rsvpDesign", unavailable(), premium()),
      row("guestMessages", unavailable(), premium()),
      row("wishlist", included(), included()),
      row("wishlistSharing", unavailable(), premium()),
      row("seatingChart", unavailable(), premium()),
    ],
  },
  {
    id: "collaboration",
    titleKey: "home.pricing.groups.collaboration",
    rows: [
      row("partnerCollaboration", unavailable(), premium()),
      row("shotList", unavailable(), premium()),
      row("pdfExports", unavailable(), premium()),
      row("printing", unavailable(), premium()),
      row("advertising", value("bannerAds", "limited"), value("adFree", "premium")),
    ],
  },
  {
    id: "recommendations",
    titleKey: "home.pricing.groups.recommendations",
    rows: [
      row("recommendationGenerations", value("recommendations1", "limited", 1), unlimited()),
      row("recommendationResults", value("results2", "limited", 2), value("results4", "premium", 4)),
      row("missingTaskScan", value("taskScanFree", "limited", 1), value("taskScanPremium", "premium")),
      row("venueLookups", value("lookups2", "limited", 2), unlimited()),
      row("moreLikeThis", unavailable(), premium()),
      row("shortlistComparison", unavailable(), premium()),
      row("followupQuestions", unavailable(), premium()),
    ],
  },
];

export const planComparisonRows = planComparisonGroups.flatMap(
  (group) => group.rows,
);

export const featuredComparisonRowIds = [
  "guests",
  "partnerCollaboration",
  "rsvpWebsite",
  "seatingChart",
  "pdfExports",
  "advertising",
] as const;

export const featuredComparisonRows = featuredComparisonRowIds.map((id) => {
  const comparisonRow = planComparisonRows.find((item) => item.id === id);
  if (!comparisonRow) throw new Error(`Missing featured comparison row: ${id}`);
  return comparisonRow;
});
