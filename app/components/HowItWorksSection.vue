<template>
  <section id="how-it-works" class="py-20">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <p class="font-accent text-champagne-gold text-2xl mb-2">
          Simple & elegant
        </p>
        <h2 class="font-display text-3xl md:text-4xl text-charcoal">
          How Wedlune Works
        </h2>
      </div>

      <div class="grid md:grid-cols-3 gap-12">
        <div v-for="(step, i) in steps" :key="step.title" class="text-center">
          <div
            class="w-16 h-16 rounded-full bg-champagne-gold/10 border-2 border-champagne-gold flex items-center justify-center text-champagne-gold font-display text-2xl mx-auto mb-6"
          >
            {{ i + 1 }}
          </div>
          <h3 class="font-display text-xl text-charcoal mb-3">
            {{ step.title }}
          </h3>
          <p class="text-warm-gray text-sm leading-relaxed max-w-xs mx-auto">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: "Create Your Profile",
    description:
      "Sign up as a couple and tell us about your wedding vision — date, location, style, and budget.",
  },
  {
    title: "Answer a Few Questions",
    description:
      "Our smart questionnaire learns your preferences across venues, food, attire, transport, and vendors.",
  },
  {
    title: "Get Your AI Plan",
    description:
      "Receive personalized recommendations, an automatic timeline, and a complete planning dashboard — all tailored to you.",
  },
];
</script>
