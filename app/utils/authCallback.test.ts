import { describe, expect, it } from "vitest";
import {
  authCallbackPath,
  buildLegacyAuthCallback,
  parseAuthCallbackFlow,
} from "./authCallback";

describe("auth callback bridge", () => {
  it("accepts only the three supported callback flows", () => {
    expect(parseAuthCallbackFlow("signup")).toBe("signup");
    expect(parseAuthCallbackFlow("invite")).toBe("invite");
    expect(parseAuthCallbackFlow("recovery")).toBe("recovery");
    expect(parseAuthCallbackFlow("oauth")).toBeNull();
    expect(parseAuthCallbackFlow(["recovery"])).toBeNull();
  });

  it("preserves the one-time response while adding a legacy flow marker", () => {
    const bridged = buildLegacyAuthCallback(
      "https://wedlune.com/auth/callback/recovery?code=one-time-code#type=recovery&access_token=private",
      "recovery",
    );
    const uri = new URL(bridged!);

    expect(uri.protocol).toBe("com.wedlune.app:");
    expect(uri.hostname).toBe("login-callback");
    expect(uri.searchParams.get("code")).toBe("one-time-code");
    expect(uri.searchParams.get("flow")).toBe("recovery");
    expect(uri.hash).toBe("#type=recovery&access_token=private");
  });

  it("rejects mismatched and insecure callback sources", () => {
    expect(
      buildLegacyAuthCallback(
        "https://wedlune.com/auth/callback/signup?code=secret",
        "invite",
      ),
    ).toBeNull();
    expect(
      buildLegacyAuthCallback(
        "http://wedlune.com/auth/callback/invite?code=secret",
        "invite",
      ),
    ).toBeNull();
    expect(
      buildLegacyAuthCallback(
        "https://attacker.example/auth/callback/invite?code=secret",
        "invite",
      ),
    ).toBeNull();
    expect(
      buildLegacyAuthCallback(
        "https://wedlune.com/auth/callback/invite",
        "invite",
      ),
    ).toBeNull();
    expect(authCallbackPath("signup")).toBe("/auth/callback/signup");
  });
});
