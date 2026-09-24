export const SITE_URL = "https://wedlune.com";

export function absoluteSiteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalized, SITE_URL);
  return url.pathname === "/" ? SITE_URL : url.toString().replace(/\/$/, "");
}

const socialLocales = { en: "en_US", sl: "sl_SI", it: "it_IT" } as const;
type SocialLocale = typeof socialLocales[keyof typeof socialLocales];

export function socialLocale(locale: string): SocialLocale {
  return socialLocales[locale as keyof typeof socialLocales] ?? socialLocales.en;
}

export function alternateSocialLocales(locale: string): SocialLocale[] {
  return Object.values(socialLocales).filter(value => value !== socialLocale(locale));
}
