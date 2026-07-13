<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-ivory-cream/90 backdrop-blur-md border-b border-linen/80"
  >
    <nav
      class="section-shell h-16 flex items-center justify-between"
      aria-label="Primary navigation"
    >
      <NuxtLink to="/" class="inline-flex items-center">
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
          to="/#features"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          Features
        </NuxtLink>
        <NuxtLink
          to="/#how-it-works"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          How It Works
        </NuxtLink>
        <NuxtLink
          to="/#pricing"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          Pricing
        </NuxtLink>
        <NuxtLink
          to="/#trust"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          Privacy
        </NuxtLink>
        <NuxtLink
          to="/#download"
          class="btn-primary px-5 py-2"
        >
          Get Wedlune
        </NuxtLink>
      </div>

      <!-- Mobile menu button -->
      <button
        class="md:hidden p-2 text-charcoal"
        :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
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
        to="/#features"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        Features
      </NuxtLink>
      <NuxtLink
        to="/#how-it-works"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        How It Works
      </NuxtLink>
      <NuxtLink
        to="/#pricing"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        Pricing
      </NuxtLink>
      <NuxtLink
        to="/#trust"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        Privacy
      </NuxtLink>
      <NuxtLink
        to="/#download"
        class="btn-primary px-5 py-2"
        @click="mobileOpen = false"
      >
        Get Wedlune
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const mobileOpen = ref(false);

const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  },
);
</script>
