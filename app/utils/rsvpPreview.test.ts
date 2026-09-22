import { describe, expect, it } from "vitest";
import { defaultRsvpDesign } from "./rsvpDesign";
import { parseRsvpPreview } from "./rsvpPreview";

const fragment = (value: unknown) => `#rsvp-preview-${Buffer.from(JSON.stringify(value)).toString("base64url")}`;

describe("RSVP preview presentation contract", () => {
  it("round trips Unicode, line breaks, plus signs and legacy version 1", () => {
    const { colorMode, heroImageFocalX, heroImageFocalY, heroImageZoom, ...legacy } = defaultRsvpDesign;
    const parsed = parseRsvpPreview(fragment({
      ...legacy, invitationHeading: "Živa + Blaž & friends",
      welcomeMessage: "First line\nDruga vrstica 🎉",
    }));
    expect(parsed).toMatchObject({
      colorMode: "brand", heroImageFocalX: 0.5, heroImageFocalY: 0.5, heroImageZoom: 1,
      invitationHeading: "Živa + Blaž & friends", welcomeMessage: "First line\nDruga vrstica 🎉",
    });
  });

  it("keeps custom presentation and drops private or unknown fields", () => {
    const parsed = parseRsvpPreview(fragment({
      ...defaultRsvpDesign, colorMode: "custom", accentColor: "#123456",
      heroImageFocalX: 0.2, heroImageZoom: 2,
      heroImageUrl: "https://example.test/signed.jpg?token=short-lived",
      heroImagePath: "private/wedding/image.jpg", token: "secret", wedding_id: "private",
    }));
    expect(parsed).toMatchObject({ colorMode: "custom", accentColor: "#123456", heroImageFocalX: 0.2, heroImageZoom: 2 });
    expect(parsed).not.toHaveProperty("heroImagePath");
    expect(parsed).not.toHaveProperty("token");
    expect(parsed).not.toHaveProperty("wedding_id");
  });

  it.each([null, [], "bad", { ...defaultRsvpDesign, version: 2 },
    { ...defaultRsvpDesign, accentColor: ["#123456"] },
    { ...defaultRsvpDesign, template: ["modern"] },
    { ...defaultRsvpDesign, colorMode: ["custom"] },
    { ...defaultRsvpDesign, heroImageZoom: 9 },
    { ...defaultRsvpDesign, welcomeMessage: "a".repeat(301) },
  ])("rejects malformed designs without throwing: %j", (value) => {
    expect(parseRsvpPreview(fragment(value))).toBeNull();
  });

  it("handles missing, broken and oversized fragments", () => {
    expect(parseRsvpPreview("")).toEqual(defaultRsvpDesign);
    expect(parseRsvpPreview("#design=%7Bbroken")).toBeNull();
    expect(parseRsvpPreview("#unrelated=1")).toBeNull();
    expect(parseRsvpPreview("a".repeat(32769))).toBeNull();
  });

  it.each(["javascript:alert(1)", "data:image/svg+xml,test", "http://example.test/image.jpg"])(
    "omits unsafe image URL %s", (heroImageUrl) => {
      expect(parseRsvpPreview(fragment({ ...defaultRsvpDesign, heroImageUrl }))?.heroImageUrl).toBeNull();
    },
  );
});
