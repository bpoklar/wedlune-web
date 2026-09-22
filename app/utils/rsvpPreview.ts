import { defaultRsvpDesign, resolveRsvpDesign, type RsvpDesign } from "./rsvpDesign";

/** Presentation travels in the fragment, never in a request or RSVP token. */
export function parseRsvpPreview(fragment: string): RsvpDesign | null {
  if (!fragment || fragment === "#") return { ...defaultRsvpDesign };
  if (fragment.length > 32768) return null;
  try {
    const hash = fragment.replace(/^#/, "");
    const encoded = hash.startsWith("rsvp-preview-") ? hash.slice("rsvp-preview-".length) : null;
    if (encoded !== null && !/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
    const raw = encoded !== null
      ? new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(
          atob(encoded.replace(/-/g, "+").replace(/_/g, "/")), (character) => character.charCodeAt(0)))
      : new URLSearchParams(hash).get("design");
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const input = value as Record<string, unknown>;
    if (
      input.version !== 1 ||
      (typeof input.template !== "string" || !["classic", "botanical", "modern"].includes(input.template)) ||
      !["accentColor", "backgroundColor", "surfaceColor"].every((key) =>
        typeof input[key] === "string" && /^#[0-9a-f]{6}$/i.test(input[key] as string)) ||
      typeof input.invitationHeading !== "string" ||
      !input.invitationHeading.trim() || input.invitationHeading.length > 60 ||
      !["welcomeMessage", "confirmationMessage"].every((key) =>
        input[key] == null || (typeof input[key] === "string" && input[key].length <= 300)) ||
      (input.colorMode !== undefined && (typeof input.colorMode !== "string" || !["brand", "custom"].includes(input.colorMode)))
    ) return null;
    for (const [key, min, max] of [
      ["heroImageFocalX", 0, 1], ["heroImageFocalY", 0, 1], ["heroImageZoom", 1, 3],
    ] as const) {
      const number = input[key];
      if (number !== undefined &&
          (typeof number !== "number" || !Number.isFinite(number) || number < min || number > max)) return null;
    }
    let heroImageUrl: string | null = null;
    if (typeof input.heroImageUrl === "string") {
      const url = new URL(input.heroImageUrl);
      if (url.protocol === "https:" ||
          (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))) {
        heroImageUrl = url.href;
      }
    }
    // Explicit allowlist: ignore IDs, tokens, private image paths and unknown
    // properties even if someone adds them to a hand-crafted preview URL.
    return resolveRsvpDesign({
      version: 1,
      template: input.template,
      ...(input.colorMode !== undefined ? { colorMode: input.colorMode } : {}),
      accentColor: input.accentColor,
      backgroundColor: input.backgroundColor,
      surfaceColor: input.surfaceColor,
      invitationHeading: input.invitationHeading,
      welcomeMessage: input.welcomeMessage ?? null,
      confirmationMessage: input.confirmationMessage ?? null,
      heroImageUrl,
      heroImageFocalX: input.heroImageFocalX ?? 0.5,
      heroImageFocalY: input.heroImageFocalY ?? 0.5,
      heroImageZoom: input.heroImageZoom ?? 1,
    });
  } catch {
    return null;
  }
}
