export const androidPackageName = "com.wedlune.app";

export const bundledAndroidFingerprints = [
  // Google Play App Signing certificate used by store-installed builds.
  "A2:71:0A:25:F1:19:6E:BF:3D:BA:20:61:BE:62:ED:0E:33:AF:4D:02:18:C7:CE:E6:E5:4A:E3:44:A0:2D:46:1A",
  // Local debug builds.
  "D2:DF:EA:94:E5:B1:EB:71:95:F5:9E:CF:FD:E7:26:EA:E5:79:DD:87:8F:ED:DE:AE:15:5B:67:4B:C0:66:3A:20",
  // Release builds signed directly with the Wedlune upload key.
  "9A:93:64:1C:42:2B:DF:42:63:DF:3F:2B:27:CC:2E:1A:B9:70:AE:9E:37:BA:A8:E2:89:B5:75:21:DF:5E:0C:1E",
] as const;

const normalizeFingerprints = (additional: string): string[] => {
  const values = additional
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter((value) => /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(value));
  return [...new Set([...bundledAndroidFingerprints, ...values])];
};

export const buildAndroidAssetLinks = (additional = "") => [
  {
    relation: [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds",
    ],
    target: {
      namespace: "android_app",
      package_name: androidPackageName,
      sha256_cert_fingerprints: normalizeFingerprints(additional),
    },
  },
];

export const buildAppleAssociation = (teamId: string) => {
  const normalizedTeamId = teamId.trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(normalizedTeamId)) return null;

  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${normalizedTeamId}.com.wedlune.app`,
          paths: ["/auth/callback/*"],
        },
      ],
    },
  };
};
