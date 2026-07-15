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
useSeoMeta({
  title: "Wedlune — AI Wedding Planner for Calm, Organized Couples",
  description:
    "Build an AI-guided wedding timeline, manage your guest list, budget, vendors, RSVPs, and plan everything together in one calm app.",
  ogTitle: "Wedlune — AI Wedding Planner for Calm, Organized Couples",
  ogDescription:
    "Build an AI-guided wedding timeline, manage your guest list, budget, vendors, RSVPs, and plan everything together in one calm app.",
  ogUrl: "https://wedlune.com",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Wedlune — AI Wedding Planner for Calm, Organized Couples",
  twitterDescription:
    "Build an AI-guided wedding timeline, manage your guest list, budget, vendors, RSVPs, and plan everything together in one calm app.",
});

useSchemaOrg([
  defineSoftwareApp({
    name: "Wedlune",
    operatingSystem: "Android, iOS",
    applicationCategory: "LifestyleApplication",
    description:
      "Build an AI-guided wedding timeline, manage your guest list, budget, vendors, RSVPs, and plan everything together in one calm app.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  }),
]);
</script>
