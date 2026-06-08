<template>
  <div>
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <TestimonialsSection />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Wedlune — AI Wedding Planning Assistant for Couples",
  description:
    "Plan your dream wedding with AI-powered recommendations. Wedlune helps couples find venues, manage vendors, track budgets, and build timelines — all in one elegant app.",
  ogTitle: "Wedlune — AI Wedding Planning Assistant for Couples",
  ogDescription:
    "Plan your dream wedding with AI-powered recommendations. Wedlune helps couples find venues, manage vendors, track budgets, and build timelines — all in one elegant app.",
  ogUrl: "https://wedlune.com",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Wedlune — AI Wedding Planning Assistant for Couples",
  twitterDescription:
    "Plan your dream wedding with AI-powered recommendations. Wedlune helps couples find venues, manage vendors, track budgets, and build timelines — all in one elegant app.",
});

useSchemaOrg([
  defineSoftwareApp({
    name: "Wedlune",
    operatingSystem: "Android, iOS",
    applicationCategory: "LifestyleApplication",
    description:
      "AI-powered wedding planning assistant that helps couples find venues, manage vendors, track budgets, and build smart timelines.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  }),
]);
</script>
