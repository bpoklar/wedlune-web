<template>
  <section id="how-it-works" class="py-20">
    <div class="section-shell">
      <div class="text-center mb-16">
        <p class="section-kicker">From overwhelmed to organized</p>
        <h2 class="section-title">How Wedlune Works</h2>
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
      "Tell Wedlune your wedding date, location, guest count, style, budget, and priorities.",
  },
  {
    title: "Get Your Plan",
    description:
      "Receive an AI-built timeline with the tasks, reminders, and decisions that matter next.",
  },
  {
    title: "Plan Together",
    description:
      "Share guests, vendors, RSVPs, budget, and progress so both partners stay in sync.",
  },
];
</script>
