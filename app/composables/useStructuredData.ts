import type { MaybeRefOrGetter } from "vue";

type JsonLdNode = Record<string, unknown>;

/** Render deterministic JSON-LD during SSR instead of relying on client hydration. */
export function useStructuredData(
  key: string,
  nodes: MaybeRefOrGetter<JsonLdNode[]>,
) {
  useHead(() => ({
    script: [{
      key: `jsonld-${key}`,
      type: "application/ld+json",
      textContent: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": toValue(nodes),
      }),
    }],
  }));
}
