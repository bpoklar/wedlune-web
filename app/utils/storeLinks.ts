const STORE_HOSTS = {
  ios: new Set(["apps.apple.com"]),
  android: new Set(["play.google.com"]),
} as const;

export type StorePlatform = keyof typeof STORE_HOSTS;

/**
 * Only publish complete HTTPS links to the official platform stores. Invalid,
 * placeholder, and unresolved values deliberately fall back to “Coming soon”.
 */
export const normalizeStoreUrl = (
  value: unknown,
  platform: StorePlatform,
): string => {
  if (typeof value !== "string" || !value.trim()) return "";

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || !STORE_HOSTS[platform].has(url.hostname)) {
      return "";
    }

    return url.toString();
  } catch {
    return "";
  }
};
