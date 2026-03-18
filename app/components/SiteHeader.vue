<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-ivory-cream/90 backdrop-blur-sm border-b border-linen"
  >
    <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="font-accent text-3xl text-champagne-gold">
        Wedlune
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-8">
        <a
          href="#features"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          How It Works
        </a>
        <NuxtLink
          to="/privacy"
          class="text-warm-gray hover:text-champagne-gold transition-colors text-sm font-semibold"
        >
          Privacy
        </NuxtLink>
        <a
          href="#download"
          class="bg-champagne-gold text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-deep-gold transition-colors"
        >
          Download App
        </a>
      </div>

      <!-- Mobile menu button -->
      <button
        class="md:hidden p-2 text-charcoal"
        :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
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
      class="md:hidden border-t border-linen bg-ivory-cream px-6 pb-4 space-y-3"
    >
      <a
        href="#features"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        Features
      </a>
      <a
        href="#how-it-works"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        How It Works
      </a>
      <NuxtLink
        to="/privacy"
        class="block text-warm-gray hover:text-champagne-gold text-sm font-semibold py-2"
        @click="mobileOpen = false"
      >
        Privacy
      </NuxtLink>
      <a
        href="#download"
        class="inline-block bg-champagne-gold text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-deep-gold transition-colors"
        @click="mobileOpen = false"
      >
        Download App
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
const mobileOpen = ref(false);
</script>
