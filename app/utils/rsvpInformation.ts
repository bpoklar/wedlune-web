export const informationFields = ["weddingDate", "ceremonyTime", "ceremonyAddress", "receptionTime", "receptionAddress", "dressCode", "parking", "transport", "accommodation", "travelLink"] as const;
export type InformationField = typeof informationFields[number];
export type RsvpInformationConfig = { version: 1; faq?: { question: string; answer: string }[] } & Partial<Record<InformationField, string>>;

export function parseRsvpInformation(value: unknown): RsvpInformationConfig | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const config = value as Record<string, unknown>;
  if (config.version !== 1 || Object.keys(config).some((key) => !["version", "faq", ...informationFields].includes(key))) return null;
  for (const field of informationFields) {
    const text = config[field];
    if (text !== undefined && (typeof text !== "string" || text.length > (["parking", "transport", "accommodation"].includes(field) ? 1200 : 500))) return null;
  }
  const date = config.weddingDate;
  if (date && (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date.startsWith("0000-") || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0,10) !== date)) return null;
  for (const field of ["ceremonyTime", "receptionTime"]) if (config[field] && !/^([01]\d|2[0-3]):[0-5]\d$/.test(config[field] as string)) return null;
  if (config.travelLink) {
    try {
      const link = new URL(config.travelLink as string);
      if (!["https:", "http:"].includes(link.protocol) || !link.hostname || link.username || link.password || /[\s<>]/.test(config.travelLink as string)) return null;
    } catch { return null; }
  }
  if (config.faq !== undefined) {
    if (!Array.isArray(config.faq) || config.faq.length > 8 || config.faq.some((entry) => !entry || typeof entry !== "object" || Object.keys(entry).length !== 2 || typeof entry.question !== "string" || !entry.question.trim() || entry.question.length > 160 || typeof entry.answer !== "string" || !entry.answer.trim() || entry.answer.length > 800)) return null;
  }
  return structuredClone(config) as RsvpInformationConfig;
}

