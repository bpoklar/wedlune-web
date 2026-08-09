<template>
  <section class="soft-page-bg pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
    <div class="section-shell">
      <div class="grid lg:grid-cols-[0.95fr_1.05fr] gap-14 items-center">
        <!-- Text content -->
        <div>
          <p
            class="inline-flex items-center gap-2 rounded-full border border-champagne-gold/30 bg-warm-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-deep-gold mb-6"
          >
            {{ $t("home.hero.badge") }}
          </p>
          <h1
            class="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.04] mb-6"
          >
            {{ $t("home.hero.title") }}
          </h1>
          <p class="text-warm-gray text-lg leading-relaxed mb-8 max-w-lg">
            {{ $t("home.hero.body") }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink
              :to="homeLink('download')"
              class="btn-primary"
            >
              {{ $t("home.hero.primary") }}
            </NuxtLink>
            <NuxtLink
              :to="homeLink('how-it-works')"
              class="btn-secondary"
            >
              {{ $t("home.hero.secondary") }}
            </NuxtLink>
          </div>
          <div
            class="mt-8 grid grid-cols-3 gap-4 max-w-lg text-center sm:text-left"
            :aria-label="$t('home.hero.highlights')"
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
                <p class="text-xs text-warm-gray">
                  {{ $t("home.hero.suggestion") }}
                </p>
              </div>

              <div class="card-surface p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                  <p class="font-display text-lg text-charcoal">
                    {{ $t("home.hero.nextAction") }}
                  </p>
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
                        {{ $t("home.hero.rsvpReminder") }}
                      </p>
                      <p class="text-xs text-warm-gray">{{ $t("home.hero.pendingGuests") }}</p>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <span class="mt-1 h-2.5 w-2.5 rounded-full bg-blush-rose" />
                    <div>
                      <p class="text-sm font-bold text-charcoal">
                        {{ $t("home.hero.floristQuote") }}
                      </p>
                      <p class="text-xs text-warm-gray">{{ $t("home.hero.vendorDecision") }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="card-surface p-4">
                  <p class="text-xs text-warm-gray">{{ $t("home.hero.budget") }}</p>
                  <p class="font-display text-2xl text-charcoal">+8%</p>
                </div>
                <div class="card-surface p-4">
                  <p class="text-xs text-warm-gray">{{ $t("home.hero.rsvps") }}</p>
                  <p class="font-display text-2xl text-charcoal">84</p>
                </div>
              </div>

              <div class="mt-4 rounded-2xl bg-champagne-gold/10 p-4">
                <p class="text-xs font-bold text-deep-gold">
                  {{ $t("home.hero.budgetWarning") }}
                </p>
                <p class="text-sm text-warm-gray">
                  {{ $t("home.hero.budgetWarningBody") }}
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
const { tm } = useI18n();
const localePath = useLocalePath();
const stats = computed(() => tm("home.hero.stats") as Array<{ value: string; label: string }>);
const homeLink = (id: string) => localePath({ path: "/", hash: `#${id}` });
</script>
