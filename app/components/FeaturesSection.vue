<template>
  <section id="features" class="py-20 bg-soft-champagne">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <p class="font-accent text-champagne-gold text-2xl mb-2">
          Everything you need
        </p>
        <h2 class="font-display text-3xl md:text-4xl text-charcoal">
          Smart Features for Every Detail
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="feature in features"
          :key="feature.title"
          class="bg-white rounded-2xl p-8 border border-linen shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl"
            :class="feature.bgClass"
          >
            {{ feature.icon }}
          </div>
          <h3 class="font-display text-xl text-charcoal mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-warm-gray text-sm leading-relaxed">
            {{ feature.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    icon: "✨",
    title: "AI Recommendations",
    description:
      "Get personalized venue, catering, vendor, and attire suggestions powered by AI — tailored to your style, budget, and location.",
    bgClass: "bg-champagne-gold/10",
  },
  {
    icon: "📅",
    title: "Smart Timeline",
    description:
      "An automatic wedding timeline generated from your answers. Track tasks, set due dates, and never miss a deadline.",
    bgClass: "bg-blush-rose/15",
  },
  {
    icon: "👥",
    title: "Guest Management",
    description:
      "Manage your guest list with RSVP tracking, dietary preferences, meal choices, table assignments, and plus-one handling.",
    bgClass: "bg-sage-green/15",
  },
  {
    icon: "💰",
    title: "Budget Tracker",
    description:
      "Keep your spending on track with category breakdowns, vendor quotes, payment tracking, and real-time budget insights.",
    bgClass: "bg-champagne-gold/10",
  },
  {
    icon: "🤝",
    title: "Vendor Hub",
    description:
      "Find photographers, DJs, florists, and more. Compare options, track booking status, and store contact details in one place.",
    bgClass: "bg-blush-rose/15",
  },
  {
    icon: "📸",
    title: "Photo Gallery",
    description:
      "Collect inspiration, save mood boards, and upload photos from fittings and venue visits to keep everything organized.",
    bgClass: "bg-sage-green/15",
  },
];
</script>
