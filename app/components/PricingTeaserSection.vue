<template>
  <section id="pricing" class="py-20 bg-soft-champagne">
    <div class="section-shell">
      <div class="card-surface overflow-hidden">
        <div class="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div class="p-8 md:p-10 bg-charcoal text-warm-white">
            <p class="font-accent text-champagne-gold text-2xl md:text-3xl mb-2">
              Get started free
            </p>
            <h2 class="font-display text-3xl md:text-4xl leading-tight mb-4">
              Build your plan first. Upgrade only when the wedding grows.
            </h2>
            <p class="text-pearl-gray leading-relaxed">
              Start with the planning essentials, then unlock more capacity and
              advanced tools when you need deeper collaboration and detail.
            </p>
          </div>

          <div class="p-8 md:p-10 grid sm:grid-cols-2 gap-5">
            <article class="rounded-2xl border border-linen bg-ivory-cream p-6">
              <h3 class="font-display text-2xl text-charcoal">Free</h3>
              <p class="text-warm-gray text-sm mt-2 mb-5">
                Essentials for getting organized.
              </p>
              <ul class="space-y-3 text-sm text-warm-gray">
                <li v-for="item in freeItems" :key="item" class="flex gap-2">
                  <span class="text-sage-green">✓</span>{{ item }}
                </li>
              </ul>
            </article>

            <article
              class="rounded-2xl border-2 border-champagne-gold bg-warm-white p-6 shadow-lg shadow-champagne-gold/10"
            >
              <p class="text-xs font-bold uppercase tracking-[0.22em] text-champagne-gold mb-2">
                Premium
              </p>
              <h3 class="font-display text-2xl text-charcoal">Unlimited</h3>
              <p class="text-warm-gray text-sm mt-2 mb-5">
                For full wedding planning power.
              </p>
              <ul class="space-y-3 text-sm text-warm-gray">
                <li
                  v-for="item in premiumItems"
                  :key="item"
                  class="flex gap-2"
                >
                  <span class="text-champagne-gold">✓</span>{{ item }}
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const freeItems = [
  "AI-built timeline and checklist",
  "Starter guests, vendors, and budget tracking",
  "Enough structure to leave spreadsheets behind",
];

const premiumItems = [
  "More room for growing guest lists and vendor shortlists",
  "Advanced views, exports, and planning tools",
  "A quieter, more complete planning experience",
];
</script>
