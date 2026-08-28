import { describe, expect, it } from "vitest";
import {
  buildAndroidAssetLinks,
  buildAppleAssociation,
} from "./mobileAssociations";

describe("mobile association payloads", () => {
  it("includes bundled and valid deployment Android fingerprints", () => {
    const extra = "AA:".repeat(31) + "AA";
    const payload = buildAndroidAssetLinks(`${extra},not-a-fingerprint`);
    const fingerprints = payload[0].target.sha256_cert_fingerprints;

    expect(payload[0].target.package_name).toBe("com.wedlune.app");
    expect(payload[0].relation).toEqual([
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds",
    ]);
    expect(fingerprints).toHaveLength(4);
    expect(fingerprints).toContain(
      "A2:71:0A:25:F1:19:6E:BF:3D:BA:20:61:BE:62:ED:0E:33:AF:4D:02:18:C7:CE:E6:E5:4A:E3:44:A0:2D:46:1A",
    );
    expect(fingerprints).toContain(extra);
  });

  it("builds a path-scoped AASA payload only for a valid Apple team ID", () => {
    expect(buildAppleAssociation("ABCDE12345")).toEqual({
      applinks: {
        apps: [],
        details: [
          {
            appID: "ABCDE12345.com.wedlune.app",
            paths: ["/auth/callback/*"],
          },
        ],
      },
    });
    expect(buildAppleAssociation("TEAM_ID")).toBeNull();
  });
});
