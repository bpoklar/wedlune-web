export interface RsvpDesign {
  version: 1;
  template: "classic" | "botanical" | "modern";
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  heroImageUrl: string | null;
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
  if (
    design.version !== 1 ||
    !["classic", "botanical", "modern"].includes(design.template ?? "") ||
    !hexColor.test(design.accentColor ?? "") ||
    !hexColor.test(design.backgroundColor ?? "") ||
    !hexColor.test(design.surfaceColor ?? "") ||
    typeof design.invitationHeading !== "string" ||
    design.invitationHeading.trim().length === 0
  ) return { ...defaultRsvpDesign };

  return {
    ...defaultRsvpDesign,
    ...design,
    invitationHeading: design.invitationHeading.trim(),
    heroImageUrl: typeof design.heroImageUrl === "string"
      ? design.heroImageUrl
      : null,
    welcomeMessage: typeof design.welcomeMessage === "string"
      ? design.welcomeMessage
      : null,
    confirmationMessage: typeof design.confirmationMessage === "string"
      ? design.confirmationMessage
      : null,
  } as RsvpDesign;
}

export function readableTextColor(hex: string): "#111827" | "#FFFFFF" {
  const value = Number.parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.55 ? "#111827" : "#FFFFFF";
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
