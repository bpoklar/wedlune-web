<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-linen/70 bg-warm-white/95 backdrop-blur-xl">
    <nav class="section-shell flex min-h-16 items-center justify-between gap-5" :aria-label="$t('nav.primary')">
      <NuxtLink :to="localePath('/')" class="inline-flex min-h-11 items-center" :aria-label="$t('nav.homeLabel')">
        <img src="/img/wedlune-logo-dark-284.png" alt="" width="142" height="29" class="h-7 w-auto">
      </NuxtLink>

      <div class="hidden items-center gap-7 lg:flex">
        <NuxtLink v-for="link in navLinks" :key="link.id" :to="homeLink(link.id)" class="inline-flex min-h-11 items-center text-sm font-bold text-warm-gray transition-colors hover:text-charcoal">
          {{ link.label }}
        </NuxtLink>
        <NuxtLink :to="homeLink('download')" class="btn-primary min-h-11 px-5 py-2">
          {{ $t("nav.getWedlune") }}
        </NuxtLink>
        <div class="flex items-center gap-1" :aria-label="$t('nav.language')">
          <NuxtLink
            v-for="option in localeOptions"
            :key="option.code"
            :to="switchTo(option.code)"
            class="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-2 text-xs font-extrabold transition-colors"
            :class="locale === option.code ? 'bg-charcoal text-white' : 'text-warm-gray hover:bg-soft-champagne hover:text-charcoal'"
            :lang="option.code"
            :aria-current="locale === option.code ? 'page' : undefined"
          >
            {{ option.short }}
          </NuxtLink>
        </div>
      </div>

      <button
        ref="menuButton"
        type="button"
        class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-charcoal hover:bg-soft-champagne lg:hidden"
        :aria-label="mobileOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-menu"
        @click="toggleMenu"
        @keydown.escape="closeMenu(true)"
      >
        <svg aria-hidden="true" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <div v-if="mobileOpen" id="mobile-menu" ref="mobileMenu" class="border-t border-linen bg-warm-white px-5 pb-6 pt-3 shadow-xl lg:hidden" @keydown.escape="closeMenu(true)">
      <nav class="mx-auto flex max-w-7xl flex-col" :aria-label="$t('nav.mobile')">
        <NuxtLink v-for="link in navLinks" :key="link.id" :to="homeLink(link.id)" class="flex min-h-12 items-center border-b border-linen/70 text-sm font-bold text-warm-gray hover:text-charcoal" @click="closeMenu(false)">
          {{ link.label }}
        </NuxtLink>
        <NuxtLink :to="homeLink('download')" class="btn-primary mt-5" @click="closeMenu(false)">
          {{ $t("nav.getWedlune") }}
        </NuxtLink>
        <div class="mt-4 flex items-center gap-2" :aria-label="$t('nav.language')">
          <NuxtLink
            v-for="option in localeOptions"
            :key="option.code"
            :to="switchTo(option.code)"
            class="inline-flex min-h-11 items-center justify-center rounded-full border border-linen px-4 text-sm font-bold"
            :class="locale === option.code ? 'bg-charcoal text-white' : 'text-warm-gray'"
            :lang="option.code"
            :aria-current="locale === option.code ? 'page' : undefined"
            @click="closeMenu(false)"
          >
            {{ option.label }}
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const mobileOpen = ref(false);
const menuButton = ref<HTMLButtonElement>();
const mobileMenu = ref<HTMLElement>();
const route = useRoute();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locale, t } = useI18n();
type SupportedLocale = "en" | "sl";

const navLinks = computed(() => [
  { id: "features", label: t("nav.features") },
  { id: "how-it-works", label: t("nav.howItWorks") },
  { id: "pricing", label: t("nav.pricing") },
  { id: "faq", label: t("nav.faq") },
]);
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

const toggleMenu = async () => {
  mobileOpen.value = !mobileOpen.value;
  if (mobileOpen.value) {
    await nextTick();
    mobileMenu.value?.querySelector<HTMLElement>("a")?.focus();
  }
};

const closeMenu = (returnFocus: boolean) => {
  if (!mobileOpen.value) return;
  mobileOpen.value = false;
  if (returnFocus) nextTick(() => menuButton.value?.focus());
};

watch(() => route.fullPath, () => closeMenu(false));
</script>
