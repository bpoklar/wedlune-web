<template>
  <section class="soft-page-bg pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
    <div class="section-shell">
      <div class="grid lg:grid-cols-[0.95fr_1.05fr] gap-14 items-center">
        <!-- Text content -->
        <div>
          <p
            class="inline-flex items-center gap-2 rounded-full border border-champagne-gold/30 bg-warm-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-deep-gold mb-6"
          >
            AI wedding planning app
          </p>
          <h1
            class="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.04] mb-6"
          >
            Plan your wedding beautifully, together.
          </h1>
          <p class="text-warm-gray text-lg leading-relaxed mb-8 max-w-lg">
            Wedlune brings your timeline, guests, budget, vendors, RSVPs, and
            AI recommendations into one calm planning space for both partners.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink
              to="/#download"
              class="btn-primary"
            >
              Get Started Free
            </NuxtLink>
            <NuxtLink
              to="/#features"
              class="btn-secondary"
            >
              See Features
            </NuxtLink>
          </div>
          <div
            class="mt-8 grid grid-cols-3 gap-4 max-w-lg text-center sm:text-left"
            aria-label="Wedlune highlights"
          >
            <div v-for="stat in stats" :key="stat.label">
              <p class="font-display text-2xl text-charcoal">{{ stat.value }}</p>
              <p class="text-xs text-warm-gray">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <!-- Product preview placeholder — replace interior with screenshots later. -->
        <div class="relative flex justify-center" aria-hidden="true">
          <div
            class="absolute -right-12 -top-10 h-56 w-56 rounded-full bg-blush-rose/20 blur-3xl"
          />
          <div
            class="relative w-72 max-w-full rounded-[3rem] border-10 border-charcoal bg-charcoal shadow-2xl shadow-champagne-gold/20"
          >
            <!-- Notch -->
            <div
              class="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-charcoal"
            />
            <div
              class="overflow-hidden rounded-[2.35rem] bg-ivory-cream p-5 pt-10"
            >
              <div class="mb-6">
                <p class="font-accent text-3xl text-champagne-gold">
                  Ana & Luka
                </p>
                <p class="text-xs text-warm-gray">Next best action</p>
              </div>

              <div class="card-surface p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                  <p class="font-display text-lg text-charcoal">Timeline</p>
                  <span class="text-xs font-bold text-sage-green">72%</span>
                </div>
                <div class="h-2 rounded-full bg-linen overflow-hidden">
                  <div class="h-full w-[72%] bg-champagne-gold rounded-full" />
                </div>
                <div class="mt-4 space-y-3">
                  <div class="flex gap-3">
                    <span class="mt-1 h-2.5 w-2.5 rounded-full bg-sage-green" />
                    <div>
                      <p class="text-sm font-bold text-charcoal">
                        Confirm photographer
                      </p>
                      <p class="text-xs text-warm-gray">Due this week</p>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <span class="mt-1 h-2.5 w-2.5 rounded-full bg-blush-rose" />
                    <div>
                      <p class="text-sm font-bold text-charcoal">
                        Finalize menu
                      </p>
                      <p class="text-xs text-warm-gray">30 days before</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="card-surface p-4">
                  <p class="text-xs text-warm-gray">Guests</p>
                  <p class="font-display text-2xl text-charcoal">84</p>
                </div>
                <div class="card-surface p-4">
                  <p class="text-xs text-warm-gray">Budget</p>
                  <p class="font-display text-2xl text-charcoal">68%</p>
                </div>
              </div>

              <div class="mt-4 rounded-2xl bg-champagne-gold/10 p-4">
                <p class="text-xs font-bold text-deep-gold">
                  AI suggestion
                </p>
                <p class="text-sm text-warm-gray">
                  Add missing RSVP reminder task.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: "1", label: "shared plan" },
  { value: "10+", label: "planning tools" },
  { value: "0", label: "spreadsheet chaos" },
];
</script>
