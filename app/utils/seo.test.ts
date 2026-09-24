import { describe, expect, it } from "vitest";
import {
  absoluteSiteUrl,
  alternateSocialLocales,
  socialLocale,
} from "./seo";

describe("SEO URL and locale helpers", () => {
  it("builds stable absolute URLs without inheriting a request query", () => {
    expect(absoluteSiteUrl("/")).toBe("https://wedlune.com");
    expect(absoluteSiteUrl("/sl/privacy")).toBe("https://wedlune.com/sl/privacy");
    expect(absoluteSiteUrl("/og/home-sl.png")).toBe("https://wedlune.com/og/home-sl.png");
  });

  it("maps all supported languages to social metadata locales", () => {
    expect(socialLocale("en")).toBe("en_US");
    expect(socialLocale("sl")).toBe("sl_SI");
    expect(alternateSocialLocales("en")).toEqual(["sl_SI", "it_IT"]);
    expect(alternateSocialLocales("sl")).toEqual(["en_US", "it_IT"]);
    expect(socialLocale("it")).toBe("it_IT");
    expect(alternateSocialLocales("it")).toEqual(["en_US", "sl_SI"]);
    expect(socialLocale("de")).toBe("en_US");
  });
});
