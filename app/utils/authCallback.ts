export const authCallbackFlows = ["signup", "invite", "recovery"] as const;

export type AuthCallbackFlow = (typeof authCallbackFlows)[number];

const authCallbackFlowSet = new Set<string>(authCallbackFlows);

export const parseAuthCallbackFlow = (
  value: unknown,
): AuthCallbackFlow | null =>
  typeof value === "string" && authCallbackFlowSet.has(value)
    ? (value as AuthCallbackFlow)
    : null;

export const authCallbackPath = (flow: AuthCallbackFlow): string =>
  `/auth/callback/${flow}`;

/**
 * Converts the HTTPS Universal/App Link into the legacy custom scheme.
 *
 * Query parameters and the fragment contain the one-time auth response and
 * must reach the native SDK unchanged. Callers must never log or render the
 * returned URL.
 */
export const buildLegacyAuthCallback = (
  sourceValue: string,
  flow: AuthCallbackFlow,
): string | null => {
  try {
    const source = new URL(sourceValue);
    if (
      source.protocol !== "https:" ||
      source.hostname !== "wedlune.com" ||
      source.pathname !== authCallbackPath(flow)
    ) {
      return null;
    }

    const fragment = new URLSearchParams(source.hash.slice(1));
    const authResponseKeys = [
      "code",
      "access_token",
      "refresh_token",
      "error",
      "error_code",
    ];
    if (
      !authResponseKeys.some(
        (key) => source.searchParams.has(key) || fragment.has(key),
      )
    ) {
      return null;
    }

    const destination = new URL("com.wedlune.app://login-callback");
    for (const [key, value] of source.searchParams) {
      destination.searchParams.append(key, value);
    }
    destination.searchParams.set("flow", flow);
    destination.hash = source.hash;
    return destination.toString();
  } catch {
    return null;
  }
};
