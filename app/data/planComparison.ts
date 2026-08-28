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
 * The human-readable source of truth is:
 * ../wedlune/docs/Monetization/MONETIZATION_PLAN.md
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
      row("guests", value("guests50", "limited", 50), unlimited()),
      row("venues", value("venues3", "limited", 3), unlimited()),
      row("vendors", value("vendors10", "limited", 10), unlimited()),
      row("caterers", value("caterers5", "limited", 5), unlimited()),
      row("attire", value("attire20", "limited", 20), unlimited()),
      row("transport", value("transport5", "limited", 5), unlimited()),
      row("gallery", value("gallery20", "limited", 20), value("gallery100", "premium", 100)),
    ],
  },
  {
    id: "guests",
    titleKey: "home.pricing.groups.guests",
    rows: [
      row("rsvpWebsite", value("defaultRsvp50", "limited", 50), premium()),
      row("rsvpDesign", unavailable(), premium()),
      row("guestMessages", unavailable(), premium()),
      row("wishlist", included(), included()),
      row("wishlistSharing", unavailable(), premium()),
      row("manualSeating", included(), included()),
      row("seatingChart", unavailable(), premium()),
    ],
  },
  {
    id: "collaboration",
    titleKey: "home.pricing.groups.collaboration",
    rows: [
      row("partnerCollaboration", included(), included()),
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
      row("recommendationGenerations", value("recommendations1", "limited", 1), value("recommendations10", "premium", 10)),
      row("recommendationResults", value("results2", "limited", 2), value("results4", "premium", 4)),
      row("missingTaskScan", value("taskScanFree", "limited", 1), value("taskScanPremium", "premium", 5)),
      row("venueLookups", value("lookups2", "limited", 2), value("lookups20", "premium", 20)),
      row("aiChat", unavailable(), value("aiChatLimits", "premium", 100)),
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
