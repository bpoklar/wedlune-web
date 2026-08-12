export const SITE_URL = "https://wedlune.com";

export function absoluteSiteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalized, SITE_URL);
  return url.pathname === "/" ? SITE_URL : url.toString().replace(/\/$/, "");
}

export function socialLocale(locale: string): "en_US" | "sl_SI" {
  return locale === "sl" ? "sl_SI" : "en_US";
}

export function alternateSocialLocale(locale: string): "en_US" | "sl_SI" {
  return locale === "sl" ? "en_US" : "sl_SI";
}
