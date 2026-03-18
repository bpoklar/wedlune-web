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
          Download Wedlune and let AI help you create the perfect wedding — from
          your first idea to your big day.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            class="inline-flex items-center justify-center gap-2 bg-champagne-gold text-white px-8 py-3 rounded-full font-bold hover:bg-deep-gold transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M17.523 2.047a.667.667 0 0 0-.372.108L3.6 10.903a.667.667 0 0 0 0 1.14l13.551 8.748a.667.667 0 0 0 1.039-.57V2.725a.667.667 0 0 0-.667-.678zM5.867 11.473l9.8-6.328v12.656l-9.8-6.328z"
              />
            </svg>
            Google Play
          </a>
          <a
            href="#"
            class="inline-flex items-center justify-center gap-2 border border-pearl-gray text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
              />
            </svg>
            App Store
          </a>
        </div>
        <p class="text-sm text-warm-gray mt-4">
          Coming soon to iOS and Android
        </p>
      </div>

      <!-- Footer links -->
      <div
        class="border-t border-warm-gray/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <p class="font-accent text-champagne-gold text-2xl">Wedlune</p>
        <div class="flex gap-6 text-sm">
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
