import type { MaybeRefOrGetter } from "vue";
import { absoluteSiteUrl, socialLocale, alternateSocialLocale } from "~/utils/seo";

interface LocalizedSeoInput {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  path: string;
  image?: MaybeRefOrGetter<string>;
  imageAlt?: MaybeRefOrGetter<string>;
  robots?: string;
  type?: "website" | "article";
}

export function useLocalizedSeo(input: LocalizedSeoInput) {
  const { locale } = useI18n();
  const localePath = useLocalePath();
  const canonical = computed(() => absoluteSiteUrl(localePath(input.path)));
  const image = computed(() => absoluteSiteUrl(input.image ? toValue(input.image) : "/og/default.png"));

  useSeoMeta({
    title: () => toValue(input.title),
    description: () => toValue(input.description),
    robots: input.robots,
    ogTitle: () => toValue(input.title),
    ogDescription: () => toValue(input.description),
    ogUrl: () => canonical.value,
    ogType: input.type || "website",
    ogSiteName: "Wedlune",
    ogLocale: () => socialLocale(locale.value),
    ogLocaleAlternate: () => alternateSocialLocale(locale.value),
    ogImage: () => image.value,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => input.imageAlt ? toValue(input.imageAlt) : toValue(input.title),
    twitterCard: "summary_large_image",
    twitterTitle: () => toValue(input.title),
    twitterDescription: () => toValue(input.description),
    twitterImage: () => image.value,
    twitterImageAlt: () => input.imageAlt ? toValue(input.imageAlt) : toValue(input.title),
  });

  useHead(() => ({
    link: [{ key: "canonical", rel: "canonical", href: canonical.value }],
  }));

  return { canonical, image };
}
