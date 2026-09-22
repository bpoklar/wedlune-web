/** WCAG contrast helpers shared by guest themes. Inputs are validated #RRGGBB. */
export function relativeLuminance(hex: string) {
  const channels = hex.slice(1).match(/../g)!.map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
}

export function contrastRatio(first: string, second: string) {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function readableTextColor(background: string): "#000000" | "#FFFFFF" {
  // True black/white guarantees >= 4.5:1 even for middle luminance colors.
  return contrastRatio(background, "#000000") >= contrastRatio(background, "#FFFFFF")
    ? "#000000" : "#FFFFFF";
}

export function mixHexColors(foreground: string, background: string, amount: number) {
  const first = parseInt(foreground.slice(1), 16);
  const second = parseInt(background.slice(1), 16);
  return `#${[16, 8, 0].map((shift) => Math.round(
    ((first >> shift) & 255) * amount + ((second >> shift) & 255) * (1 - amount),
  ).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

export function accessibleColor(color: string, background: string, minimum = 4.5) {
  const target = readableTextColor(background);
  let candidate = color;
  for (let step = 0; step < 32; step += 1) {
    if (contrastRatio(candidate, background) >= minimum) return candidate;
    candidate = mixHexColors(candidate, target, 0.82);
  }
  return target;
}
