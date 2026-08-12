export interface RsvpDesign {
  version: 1;
  template: "classic" | "botanical" | "modern";
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  heroImageUrl: string | null;
  heroImageFocalX: number;
  heroImageFocalY: number;
  heroImageZoom: number;
  invitationHeading: string;
  welcomeMessage: string | null;
  confirmationMessage: string | null;
}

export const defaultRsvpDesign: RsvpDesign = {
  version: 1,
  template: "classic",
  accentColor: "#B88A4A",
  backgroundColor: "#FAF7F2",
  surfaceColor: "#FFFFFF",
  heroImageUrl: null,
  heroImageFocalX: 0.5,
  heroImageFocalY: 0.5,
  heroImageZoom: 1,
  invitationHeading: "You're Invited",
  welcomeMessage: null,
  confirmationMessage: null,
};

const hexColor = /^#[0-9a-f]{6}$/i;

export function resolveRsvpDesign(value: unknown): RsvpDesign {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaultRsvpDesign };
  }
  const design = value as Partial<RsvpDesign>;
  const focalX = hasOwn(design, "heroImageFocalX")
    ? design.heroImageFocalX
    : 0.5;
  const focalY = hasOwn(design, "heroImageFocalY")
    ? design.heroImageFocalY
    : 0.5;
  const zoom = hasOwn(design, "heroImageZoom") ? design.heroImageZoom : 1;
  if (
    design.version !== 1 ||
    !["classic", "botanical", "modern"].includes(design.template ?? "") ||
    !hexColor.test(design.accentColor ?? "") ||
    !hexColor.test(design.backgroundColor ?? "") ||
    !hexColor.test(design.surfaceColor ?? "") ||
    typeof design.invitationHeading !== "string" ||
    design.invitationHeading.trim().length === 0 ||
    !numberInRange(focalX, 0, 1) ||
    !numberInRange(focalY, 0, 1) ||
    !numberInRange(zoom, 1, 3)
  ) return { ...defaultRsvpDesign };

  return {
    ...defaultRsvpDesign,
    ...design,
    invitationHeading: design.invitationHeading.trim(),
    heroImageUrl: typeof design.heroImageUrl === "string"
      ? design.heroImageUrl
      : null,
    heroImageFocalX: focalX,
    heroImageFocalY: focalY,
    heroImageZoom: zoom,
    welcomeMessage: typeof design.welcomeMessage === "string"
      ? design.welcomeMessage
      : null,
    confirmationMessage: typeof design.confirmationMessage === "string"
      ? design.confirmationMessage
      : null,
  } as RsvpDesign;
}

function numberInRange(value: unknown, minimum: number, maximum: number) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum;
}

function hasOwn(value: object, key: string) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

export function createHeroImageStyle(design: RsvpDesign) {
  const position = `${design.heroImageFocalX * 100}% ${design.heroImageFocalY * 100}%`;
  return {
    objectPosition: position,
    transform: `scale(${design.heroImageZoom})`,
    transformOrigin: position,
  } as const;
}

export function readableTextColor(hex: string): "#111827" | "#FFFFFF" {
  return contrastRatio(hex, "#111827") >= contrastRatio(hex, "#FFFFFF")
    ? "#111827"
    : "#FFFFFF";
}

function relativeLuminance(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channel = (shift: number) => {
    const srgb = ((value >> shift) & 255) / 255;
    return srgb <= 0.04045
      ? srgb / 12.92
      : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  return (0.2126 * channel(16)) + (0.7152 * channel(8)) + (0.0722 * channel(0));
}

function contrastRatio(first: string, second: string) {
  const light = Math.max(relativeLuminance(first), relativeLuminance(second));
  const dark = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (light + 0.05) / (dark + 0.05);
}

function accessibleAccentText(accent: string, surface: string) {
  if (contrastRatio(accent, surface) >= 4.5) return accent;
  let candidate = accent;
  for (let step = 0; step < 16; step += 1) {
    candidate = mixHexColors(candidate, "#111827", 0.82);
    if (contrastRatio(candidate, surface) >= 4.5) return candidate;
  }
  return readableTextColor(surface);
}

function mixHexColors(foreground: string, background: string, amount: number) {
  const foregroundValue = Number.parseInt(foreground.slice(1), 16);
  const backgroundValue = Number.parseInt(background.slice(1), 16);
  const channel = (shift: number) => Math.round(
    (((foregroundValue >> shift) & 255) * amount)
      + (((backgroundValue >> shift) & 255) * (1 - amount)),
  );
  return `#${[channel(16), channel(8), channel(0)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

export function createRsvpTheme(design: RsvpDesign) {
  const mutedSurface = mixHexColors(
    design.accentColor,
    design.surfaceColor,
    0.09,
  );
  const inputSurface = mixHexColors(
    design.backgroundColor,
    design.surfaceColor,
    0.18,
  );

  return {
    "--rsvp-accent": design.accentColor,
    "--rsvp-accent-text": accessibleAccentText(
      design.accentColor,
      design.surfaceColor,
    ),
    "--rsvp-background": design.backgroundColor,
    "--rsvp-surface": design.surfaceColor,
    "--rsvp-text": readableTextColor(design.surfaceColor),
    "--rsvp-on-accent": readableTextColor(design.accentColor),
    "--rsvp-muted-surface": mutedSurface,
    "--rsvp-muted-text": readableTextColor(mutedSurface),
    "--rsvp-input-surface": inputSurface,
    "--rsvp-input-text": readableTextColor(inputSurface),
    "--rsvp-border": mixHexColors(design.accentColor, design.surfaceColor, 0.24),
  } as const;
}
