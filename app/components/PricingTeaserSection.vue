<template>
  <section id="pricing" class="py-20 bg-soft-champagne">
    <div class="section-shell">
      <div class="card-surface overflow-hidden">
        <div class="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div class="p-8 md:p-10 bg-charcoal text-warm-white">
            <p class="font-accent text-champagne-gold text-2xl md:text-3xl mb-2">
              {{ $t("home.pricing.kicker") }}
            </p>
            <h2 class="font-display text-3xl md:text-4xl leading-tight mb-4">
              {{ $t("home.pricing.title") }}
            </h2>
            <p class="text-pearl-gray leading-relaxed">
              {{ $t("home.pricing.subtitle") }}
            </p>
          </div>

          <div class="p-8 md:p-10 grid sm:grid-cols-2 gap-5">
            <article class="rounded-2xl border border-linen bg-ivory-cream p-6">
              <h3 class="font-display text-2xl text-charcoal">{{ $t("home.pricing.free") }}</h3>
              <p class="text-warm-gray text-sm mt-2 mb-5">
                {{ $t("home.pricing.freeSubtitle") }}
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
                {{ $t("home.pricing.premium") }}
              </p>
              <h3 class="font-display text-2xl text-charcoal">{{ $t("home.pricing.unlimited") }}</h3>
              <p class="text-warm-gray text-sm mt-2 mb-5">
                {{ $t("home.pricing.premiumSubtitle") }}
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
const { tm } = useI18n();
const freeItems = computed(() => tm("home.pricing.freeItems") as string[]);
const premiumItems = computed(() => tm("home.pricing.premiumItems") as string[]);
</script>
