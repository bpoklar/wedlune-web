<template>
  <header
    data-site-header
    :data-visible="headerVisible"
    class="fixed inset-x-0 top-0 z-50 border-b border-sand-beige/60 bg-ivory-cream/95 shadow-sm backdrop-blur-xl transition-transform duration-300 ease-out will-change-transform"
    :class="headerVisible || mobileOpen ? 'translate-y-0' : '-translate-y-full'"
    @focusin="showHeader"
  >
    <nav class="section-shell flex min-h-16 items-center justify-between gap-5" :aria-label="$t('nav.primary')">
      <NuxtLink :to="localePath('/')" class="inline-flex min-h-11 items-center" :aria-label="$t('nav.homeLabel')">
        <img src="/img/wedlune-logo-dark-284.png" alt="" width="142" height="29" class="h-7 w-auto">
      </NuxtLink>

      <div class="hidden items-center gap-7 lg:flex">
        <NuxtLink v-for="link in navLinks" :key="link.id" :to="homeLink(link.id)" class="inline-flex min-h-11 items-center text-sm font-bold text-warm-gray transition-colors hover:text-deep-gold">
          {{ link.label }}
        </NuxtLink>
        <NuxtLink data-nav-cta :to="homeLink('download')" class="inline-flex min-h-11 items-center justify-center rounded-full bg-warm-camel px-5 py-2 text-sm font-extrabold text-charcoal shadow-md transition-[background-color,color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-deep-gold hover:text-white hover:shadow-lg">
          {{ $t("nav.getWedlune") }}
        </NuxtLink>
        <div class="language-switcher" :aria-label="$t('nav.language')">
          <NuxtLink
            v-for="option in localeOptions"
            :key="option.code"
            data-language-option
            :to="switchTo(option.code)"
            class="language-option"
            :class="{ 'is-active': locale === option.code }"
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
        class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-deep-gold transition-colors hover:bg-sand-beige/30 lg:hidden"
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

    <Transition name="mobile-menu">
      <div v-if="mobileOpen" id="mobile-menu" ref="mobileMenu" class="border-t border-sand-beige/55 bg-ivory-cream px-5 pb-6 pt-3 shadow-xl transition-[opacity,transform] duration-200 ease-out lg:hidden" @keydown.escape="closeMenu(true)">
        <nav class="mx-auto flex max-w-7xl flex-col" :aria-label="$t('nav.mobile')">
          <NuxtLink v-for="link in navLinks" :key="link.id" :to="homeLink(link.id)" class="flex min-h-12 items-center border-b border-sand-beige/45 text-sm font-bold text-warm-gray transition-colors hover:text-deep-gold" @click="closeMenu(false)">
            {{ link.label }}
          </NuxtLink>
          <NuxtLink data-nav-cta :to="homeLink('download')" class="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-warm-camel px-7 py-3 text-sm font-extrabold text-charcoal shadow-md transition-colors hover:bg-deep-gold hover:text-white" @click="closeMenu(false)">
            {{ $t("nav.getWedlune") }}
          </NuxtLink>
          <div class="language-switcher language-switcher-mobile mt-4" :aria-label="$t('nav.language')">
            <NuxtLink
              v-for="option in localeOptions"
              :key="option.code"
              data-language-option
              :to="switchTo(option.code)"
              class="language-option"
              :class="{ 'is-active': locale === option.code }"
              :lang="option.code"
              :aria-current="locale === option.code ? 'page' : undefined"
              @click="closeMenu(false)"
            >
              {{ option.label }}
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const mobileOpen = ref(false);
const headerVisible = ref(true);
const lastScrollY = ref(0);
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

const showHeader = () => {
  headerVisible.value = true;
};

const handleScroll = () => {
  const currentScrollY = Math.max(window.scrollY, 0);

  if (mobileOpen.value || currentScrollY <= 24) {
    showHeader();
    lastScrollY.value = currentScrollY;
    return;
  }

  if (Math.abs(currentScrollY - lastScrollY.value) < 8) return;
  headerVisible.value = currentScrollY < lastScrollY.value;
  lastScrollY.value = currentScrollY;
};

const toggleMenu = async () => {
  showHeader();
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

watch(() => route.fullPath, () => {
  closeMenu(false);
  showHeader();
});

onMounted(() => {
  lastScrollY.value = window.scrollY;
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));
</script>

<style scoped>
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transform-origin: top;
}
</style>
