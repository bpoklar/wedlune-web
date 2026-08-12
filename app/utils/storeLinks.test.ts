import { describe, expect, it } from "vitest";
import { normalizeStoreUrl } from "./storeLinks";

describe("normalizeStoreUrl", () => {
  it("accepts complete HTTPS links on the matching official store", () => {
    expect(normalizeStoreUrl("https://apps.apple.com/us/app/wedlune/id123", "ios"))
      .toBe("https://apps.apple.com/us/app/wedlune/id123");
    expect(normalizeStoreUrl("https://play.google.com/store/apps/details?id=com.wedlune", "android"))
      .toBe("https://play.google.com/store/apps/details?id=com.wedlune");
  });

  it("rejects unresolved, insecure, mismatched, and lookalike URLs", () => {
    expect(normalizeStoreUrl("", "ios")).toBe("");
    expect(normalizeStoreUrl("coming-soon", "ios")).toBe("");
    expect(normalizeStoreUrl("http://apps.apple.com/app/wedlune", "ios")).toBe("");
    expect(normalizeStoreUrl("https://play.google.com/store/apps/wedlune", "ios")).toBe("");
    expect(normalizeStoreUrl("https://apps.apple.com.evil.example/wedlune", "ios")).toBe("");
  });
});
