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
  title: "Wedlune — Your Elegant AI Wedding Planner",
  description:
    "Budgets, RSVPs, smart timelines, and AI recommendations. Your entire wedding, beautifully organized in one app.",
  ogTitle: "Wedlune — Your Elegant AI Wedding Planner",
  ogDescription:
    "Budgets, RSVPs, smart timelines, and AI recommendations. Your entire wedding, beautifully organized in one app.",
  ogUrl: "https://wedlune.com",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Wedlune — Your Elegant AI Wedding Planner",
  twitterDescription:
    "Budgets, RSVPs, smart timelines, and AI recommendations. Your entire wedding, beautifully organized in one app.",
});

useSchemaOrg([
  defineSoftwareApp({
    name: "Wedlune",
    operatingSystem: "Android, iOS",
    applicationCategory: "LifestyleApplication",
    description:
      "Budgets, RSVPs, smart timelines, and AI recommendations. Your entire wedding, beautifully organized in one app.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  }),
]);
</script>
