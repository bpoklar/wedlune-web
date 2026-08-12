import { describe, expect, it } from "vitest";
import {
  absoluteSiteUrl,
  alternateSocialLocale,
  socialLocale,
} from "./seo";

describe("SEO URL and locale helpers", () => {
  it("builds stable absolute URLs without inheriting a request query", () => {
    expect(absoluteSiteUrl("/")).toBe("https://wedlune.com");
    expect(absoluteSiteUrl("/sl/privacy")).toBe("https://wedlune.com/sl/privacy");
    expect(absoluteSiteUrl("/og/home-sl.png")).toBe("https://wedlune.com/og/home-sl.png");
  });

  it("maps both supported languages to social metadata locales", () => {
    expect(socialLocale("en")).toBe("en_US");
    expect(socialLocale("sl")).toBe("sl_SI");
    expect(alternateSocialLocale("en")).toBe("sl_SI");
    expect(alternateSocialLocale("sl")).toBe("en_US");
  });
});
