<template>
  <footer id="download" class="bg-charcoal text-pearl-gray">
    <div class="max-w-6xl mx-auto px-6 py-16">
      <!-- CTA banner -->
      <div class="text-center mb-16">
        <p class="font-accent text-champagne-gold text-3xl mb-4">
          Start your journey
        </p>
        <h2 class="font-display text-3xl md:text-4xl text-white mb-4">
          Plan Your Dream Wedding
        </h2>
        <p class="text-pearl-gray max-w-xl mx-auto mb-8">
          Wedlune is preparing for store launch. Join the waitlist or replace
          this block with live store links when your listings are ready.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@wedlune.app?subject=Wedlune%20waitlist"
            class="btn-primary"
          >
            Join the waitlist
          </a>
          <NuxtLink
            to="/#features"
            class="inline-flex items-center justify-center rounded-full border border-pearl-gray px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Explore features
          </NuxtLink>
        </div>
        <p class="text-sm text-warm-gray mt-4">
          Coming soon to iOS and Android
        </p>
      </div>

      <!-- Footer links -->
      <div
        class="border-t border-warm-gray/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <NuxtImg
          src="/img/wedlune-logo-light.png"
          alt="Wedlune"
          class="h-4 w-auto"
          width="142"
          height="28"
        />
        <div class="flex flex-wrap justify-center gap-6 text-sm">
          <NuxtLink
            to="/#features"
            class="hover:text-champagne-gold transition-colors"
          >
            Features
          </NuxtLink>
          <NuxtLink
            to="/#pricing"
            class="hover:text-champagne-gold transition-colors"
          >
            Pricing
          </NuxtLink>
          <NuxtLink
            to="/privacy"
            class="hover:text-champagne-gold transition-colors"
          >
            Privacy Policy
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="hover:text-champagne-gold transition-colors"
          >
            Terms of Service
          </NuxtLink>
        </div>
        <p class="text-sm text-warm-gray">
          &copy; {{ new Date().getFullYear() }} Wedlune. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
