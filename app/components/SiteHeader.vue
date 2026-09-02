<template>
  <header
    data-site-header
    :data-visible="headerVisible"
    class="fixed inset-x-0 top-0 z-50 border-b border-sand-beige/50 bg-warm-white/92 shadow-sm backdrop-blur-xl transition-transform duration-300 ease-out will-change-transform"
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
        <NuxtLink data-nav-cta :to="homeLink('download')" class="nav-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold text-white">
          <span class="text-soft-champagne" aria-hidden="true">✦</span>
          {{ $t("nav.getWedlune") }}
        </NuxtLink>
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
        <svg aria-hidden="true" class="h-6 w-6 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" :class="mobileOpen ? 'rotate-90' : 'rotate-0'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <Transition name="mobile-menu" @after-enter="focusFirstMenuItem">
      <div v-show="mobileOpen" id="mobile-menu" ref="mobileMenu" class="mobile-menu-panel border-t border-sand-beige/55 bg-warm-white px-5 pb-6 pt-3 shadow-xl lg:hidden" @keydown.escape="closeMenu(true)">
        <nav data-mobile-menu-items class="mx-auto flex max-w-7xl flex-col" :aria-label="$t('nav.mobile')">
          <NuxtLink v-for="link in navLinks" :key="link.id" :to="homeLink(link.id)" class="flex min-h-12 items-center border-b border-sand-beige/45 text-sm font-bold text-warm-gray transition-colors hover:text-deep-gold" @click="closeMenu(false)">
            {{ link.label }}
          </NuxtLink>
          <NuxtLink data-nav-cta :to="homeLink('download')" class="nav-cta mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-extrabold text-white" @click="closeMenu(false)">
            <span class="text-soft-champagne" aria-hidden="true">✦</span>
            {{ $t("nav.getWedlune") }}
          </NuxtLink>
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
const { t } = useI18n();

const navLinks = computed(() => [
  { id: "features", label: t("nav.features") },
  { id: "how-it-works", label: t("nav.howItWorks") },
  { id: "pricing", label: t("nav.pricing") },
  { id: "faq", label: t("nav.faq") },
]);
const homeLink = (id: string) => localePath({ path: "/", hash: `#${id}` });

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

const toggleMenu = () => {
  showHeader();
  mobileOpen.value = !mobileOpen.value;
};

const focusFirstMenuItem = () => {
  if (!mobileOpen.value) return;
  mobileMenu.value?.querySelector<HTMLElement>("a")?.focus();
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
.nav-cta {
  background-color: var(--site-surface-strong);
  background-image: linear-gradient(105deg, #241f1b 0%, #3a2c21 50%, #241f1b 100%);
  background-position: left center;
  background-size: 180% 100%;
  box-shadow: 0 8px 20px rgb(36 31 27 / 0.18);
  transition: transform 220ms ease, box-shadow 220ms ease, background-position 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-cta:hover {
  background-position: right center;
  box-shadow: 0 11px 26px rgb(36 31 27 / 0.24);
  transform: translateY(-0.1rem);
}

.mobile-menu-panel {
  transform-origin: top center;
  transition-property: opacity, transform;
  transition-duration: 480ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translate3d(0, -0.4rem, 0);
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.mobile-menu-leave-active {
  pointer-events: none;
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.32, 0, 0.18, 1);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translate3d(0, -0.3rem, 0);
}

.mobile-menu-enter-active [data-mobile-menu-items] > * {
  animation: mobile-menu-item-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.mobile-menu-enter-active [data-mobile-menu-items] > :nth-child(2) {
  animation-delay: 20ms;
}

.mobile-menu-enter-active [data-mobile-menu-items] > :nth-child(3) {
  animation-delay: 40ms;
}

.mobile-menu-enter-active [data-mobile-menu-items] > :nth-child(4) {
  animation-delay: 60ms;
}

.mobile-menu-enter-active [data-mobile-menu-items] > :nth-child(5) {
  animation-delay: 80ms;
}

.mobile-menu-enter-active [data-mobile-menu-items] > :nth-child(6) {
  animation-delay: 100ms;
}

.mobile-menu-leave-active [data-mobile-menu-items] {
  transition: opacity 300ms ease, transform 360ms cubic-bezier(0.32, 0, 0.18, 1);
}

.mobile-menu-leave-to [data-mobile-menu-items] {
  opacity: 0;
  transform: translate3d(0, -0.2rem, 0);
}

@keyframes mobile-menu-item-in {
  from {
    opacity: 0;
    transform: translate3d(0, -0.35rem, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
