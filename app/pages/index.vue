<template>
  <div>
    <HeroSection />
    <ProofStrip />
    <PlanningStorySection />
    <FeaturesSection />
    <TrustSection />
    <HowItWorksSection />
    <AiTrustSection />
    <PricingTeaserSection />
    <FaqSection />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();

useLocalizedSeo({
  title: () => t("home.seoTitle"),
  description: () => t("home.seoDescription"),
  path: "/",
  image: computed(() => locale.value === "sl" ? "/og/home-sl.png" : "/og/home-en-v2.png"),
  imageAlt: () => t("home.ogImageAlt"),
});

useStructuredData("homepage", () => [
  {
    "@type": "WebSite",
    "@id": "https://wedlune.com/#website",
    name: "Wedlune",
    url: "https://wedlune.com",
    inLanguage: locale.value === "sl" ? "sl" : "en",
  },
  {
    "@type": "SoftwareApplication",
    "@id": "https://wedlune.com/#app",
    name: "Wedlune",
    operatingSystem: "Android, iOS",
    applicationCategory: "LifestyleApplication",
    description: t("home.seoDescription"),
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  },
]);
</script>
