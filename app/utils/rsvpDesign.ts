import { accessibleColor, mixHexColors, readableTextColor } from "./colorTheme";

export type RsvpColorMode = "brand" | "custom";

export interface RsvpDesign {
  version: 1;
  colorMode?: RsvpColorMode;
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
  colorMode: "brand",
  accentColor: "#C9A96E",
  backgroundColor: "#FDF8F2",
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
    (hasOwn(design, "colorMode") && !["brand", "custom"].includes(design.colorMode ?? "")) ||
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
    colorMode: resolveRsvpColorMode(design as RsvpDesign),
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

/** Only exact historical defaults are inferred; explicit choices always win. */
export function resolveRsvpColorMode(design: Pick<RsvpDesign, "colorMode" | "accentColor" | "backgroundColor" | "surfaceColor">): RsvpColorMode {
  if (design.colorMode) return design.colorMode;
  const palette = [design.accentColor, design.backgroundColor, design.surfaceColor].map((color) => color.toUpperCase()).join("/");
  return ["#B88A4A/#FAF7F2/#FFFFFF", "#C9A96E/#FDF8F2/#FFFFFF"].includes(palette) ? "brand" : "custom";
}

export function createRsvpTheme(design: RsvpDesign): Record<string, string> {
  const shared = {
    "--rsvp-accepted-surface": "var(--site-success-bg)",
    "--rsvp-accepted-text": "var(--site-success)",
    "--rsvp-error": "var(--site-error)",
    "--rsvp-error-surface": "var(--site-error-bg)",
  };
  if (resolveRsvpColorMode(design) === "brand") {
    return {
      ...shared,
      "--rsvp-background": "var(--site-bg)",
      "--rsvp-background-text": "var(--site-text)",
      "--rsvp-surface": "var(--site-surface)",
      "--rsvp-text": "var(--site-text)",
      "--rsvp-text-muted": "var(--site-text-muted)",
      "--rsvp-muted-surface": "var(--site-bg-soft)",
      "--rsvp-muted-text": "var(--site-text)",
      "--rsvp-muted-secondary": "var(--site-text-muted)",
      "--rsvp-input-surface": "var(--site-surface)",
      "--rsvp-input-text": "var(--site-text)",
      "--rsvp-input-secondary": "var(--site-text-muted)",
      "--rsvp-border": "var(--site-border)",
      "--rsvp-control-border": "var(--site-control-border)",
      "--rsvp-input-border": "var(--site-control-border)",
      "--rsvp-muted-border": "var(--site-control-border)",
      "--rsvp-primary": "var(--site-accent)",
      "--rsvp-primary-text": "var(--site-on-accent)",
      "--rsvp-primary-hover": "var(--site-accent-hover)",
      "--rsvp-primary-hover-text": "var(--site-on-accent)",
      "--rsvp-primary-pressed": "var(--site-accent-pressed)",
      "--rsvp-primary-pressed-text": "var(--site-on-accent)",
      "--rsvp-accent": "var(--site-accent)",
      "--rsvp-accent-text": "var(--site-text)",
      "--rsvp-on-accent": "var(--site-on-accent)",
      "--rsvp-selection": "var(--site-selection)",
      "--rsvp-selection-text": "var(--site-text)",
      "--rsvp-selection-border": "var(--site-accent-strong)",
      "--rsvp-focus": "var(--site-focus)",
      "--rsvp-focus-inner": "var(--site-surface)",
    };
  }
  const muted = mixHexColors(design.accentColor, design.surfaceColor, 0.09);
  const input = mixHexColors(design.backgroundColor, design.surfaceColor, 0.18);
  const selection = mixHexColors(design.accentColor, design.surfaceColor, 0.12);
  const hover = mixHexColors(design.accentColor, readableTextColor(design.accentColor), 0.92);
  const pressed = mixHexColors(design.accentColor, readableTextColor(design.accentColor), 0.84);
  const focus = readableTextColor(design.backgroundColor);
  return {
    ...shared,
    "--rsvp-background": design.backgroundColor,
    "--rsvp-background-text": readableTextColor(design.backgroundColor),
    "--rsvp-surface": design.surfaceColor,
    "--rsvp-text": readableTextColor(design.surfaceColor),
    "--rsvp-text-muted": accessibleColor(mixHexColors(readableTextColor(design.surfaceColor), design.surfaceColor, 0.72), design.surfaceColor),
    "--rsvp-muted-surface": muted,
    "--rsvp-muted-text": readableTextColor(muted),
    "--rsvp-muted-secondary": accessibleColor(mixHexColors(readableTextColor(muted), muted, 0.72), muted),
    "--rsvp-input-surface": input,
    "--rsvp-input-text": readableTextColor(input),
    "--rsvp-input-secondary": accessibleColor(mixHexColors(readableTextColor(input), input, 0.72), input),
    "--rsvp-border": mixHexColors(design.accentColor, design.surfaceColor, 0.24),
    "--rsvp-control-border": accessibleColor(design.accentColor, design.surfaceColor, 3),
    "--rsvp-input-border": accessibleColor(design.accentColor, input, 3),
    "--rsvp-muted-border": accessibleColor(design.accentColor, muted, 3),
    "--rsvp-primary": design.accentColor,
    "--rsvp-primary-text": readableTextColor(design.accentColor),
    "--rsvp-primary-hover": hover,
    "--rsvp-primary-hover-text": readableTextColor(hover),
    "--rsvp-primary-pressed": pressed,
    "--rsvp-primary-pressed-text": readableTextColor(pressed),
    "--rsvp-accent": design.accentColor,
    "--rsvp-accent-text": accessibleColor(design.accentColor, design.surfaceColor),
    "--rsvp-on-accent": readableTextColor(design.accentColor),
    "--rsvp-selection": selection,
    "--rsvp-selection-text": readableTextColor(selection),
    "--rsvp-selection-border": accessibleColor(design.accentColor, selection, 3),
    "--rsvp-focus": focus,
    "--rsvp-focus-inner": focus === "#FFFFFF" ? "#000000" : "#FFFFFF",
  };
}
