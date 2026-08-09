<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-ivory-cream/90 backdrop-blur-md border-b border-linen/80"
  >
    <nav
      class="section-shell h-16 flex items-center justify-between"
      :aria-label="$t('nav.primary')"
    >
      <NuxtLink :to="localePath('/')" class="inline-flex items-center">
        <img
          src="/img/wedlune-logo-dark.png"
          alt="Wedlune"
          class="h-7 w-auto"
          width="142"
          height="28"
        />
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          :to="homeLink('features')"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          {{ $t("nav.features") }}
        </NuxtLink>
        <NuxtLink
          :to="homeLink('how-it-works')"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          {{ $t("nav.howItWorks") }}
        </NuxtLink>
        <NuxtLink
          :to="homeLink('pricing')"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          {{ $t("nav.pricing") }}
        </NuxtLink>
        <NuxtLink :to="homeLink('download')" class="btn-primary px-5 py-2">
          {{ $t("nav.getWedlune") }}
        </NuxtLink>
        <div class="flex items-center gap-1" :aria-label="$t('nav.language')">
          <NuxtLink
            v-for="option in localeOptions"
            :key="option.code"
            :to="switchTo(option.code)"
            class="rounded-full px-2 py-1 text-xs font-bold transition-colors"
            :class="locale === option.code ? 'bg-champagne-gold text-white' : 'text-warm-gray hover:text-champagne-gold'"
            :lang="option.code"
            :aria-current="locale === option.code ? 'page' : undefined"
          >
            {{ option.short }}
          </NuxtLink>
        </div>
      </div>

      <!-- Mobile menu button -->
      <button
        class="md:hidden p-2 text-charcoal"
        :aria-label="mobileOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-menu"
        @click="mobileOpen = !mobileOpen"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!mobileOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </nav>

    <!-- Mobile nav -->
    <div
      v-if="mobileOpen"
      id="mobile-menu"
      class="md:hidden border-t border-linen bg-ivory-cream px-6 pb-4 space-y-3"
    >
      <NuxtLink
        :to="homeLink('features')"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        {{ $t("nav.features") }}
      </NuxtLink>
      <NuxtLink
        :to="homeLink('how-it-works')"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        {{ $t("nav.howItWorks") }}
      </NuxtLink>
      <NuxtLink
        :to="homeLink('pricing')"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        {{ $t("nav.pricing") }}
      </NuxtLink>
      <NuxtLink
        :to="homeLink('trust')"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        {{ $t("nav.privacy") }}
      </NuxtLink>
      <NuxtLink
        :to="homeLink('download')"
        class="btn-primary px-5 py-2"
        @click="mobileOpen = false"
      >
        {{ $t("nav.getWedlune") }}
      </NuxtLink>
      <div class="flex items-center gap-2 pt-2" :aria-label="$t('nav.language')">
        <NuxtLink
          v-for="option in localeOptions"
          :key="option.code"
          :to="switchTo(option.code)"
          class="rounded-full border border-linen px-3 py-2 text-sm font-semibold"
          :class="locale === option.code ? 'bg-champagne-gold text-white' : 'text-warm-gray'"
          :lang="option.code"
          @click="mobileOpen = false"
        >
          {{ option.label }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const mobileOpen = ref(false);
const route = useRoute();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locale, t } = useI18n();
type SupportedLocale = "en" | "sl";
const localeOptions = computed(() => [
  { code: "en", short: "EN", label: t("nav.english") },
  { code: "sl", short: "SL", label: t("nav.slovenian") },
] as const);

const homeLink = (id: string) => localePath({ path: "/", hash: `#${id}` });
const switchTo = (code: SupportedLocale) => ({
  path: switchLocalePath(code),
  query: route.query,
  hash: route.hash,
});

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  },
);
</script>
