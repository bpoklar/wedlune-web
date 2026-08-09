<template>
  <div>
    <HeroSection />
    <FeaturesSection />
    <TrustSection id="trust" />
    <HowItWorksSection />
    <PricingTeaserSection />
    <TestimonialsSection />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();

useSeoMeta({
  title: () => t("home.seoTitle"),
  description: () => t("home.seoDescription"),
  ogTitle: () => t("home.seoTitle"),
  ogDescription: () => t("home.seoDescription"),
  ogUrl: () => locale.value === "sl" ? "https://wedlune.com/sl" : "https://wedlune.com",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: () => t("home.seoTitle"),
  twitterDescription: () => t("home.seoDescription"),
});

useSchemaOrg(() => [
  defineSoftwareApp({
    name: "Wedlune",
    operatingSystem: "Android, iOS",
    applicationCategory: "LifestyleApplication",
    description: t("home.seoDescription"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  }),
]);
</script>
