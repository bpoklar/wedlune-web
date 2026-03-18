<template>
  <div>
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <TestimonialsSection />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Wedlune — AI Wedding Planning Assistant for Couples",
  meta: [
    {
      name: "description",
      content:
        "Plan your dream wedding with AI-powered recommendations. Wedlune helps couples find venues, manage vendors, track budgets, and build timelines — all in one elegant app.",
    },
  ],
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
