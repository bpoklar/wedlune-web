<template>
  <footer id="download" class="bg-charcoal text-pearl-gray">
    <div class="max-w-6xl mx-auto px-6 py-16">
      <!-- CTA banner -->
      <div class="text-center mb-16">
        <p class="font-accent text-champagne-gold text-3xl mb-4">
          {{ $t("footer.kicker") }}
        </p>
        <h2 class="font-display text-3xl md:text-4xl text-white mb-4">
          {{ $t("footer.title") }}
        </h2>
        <p class="text-pearl-gray max-w-xl mx-auto mb-8">
          {{ $t("footer.body") }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:hi@wedlune.com?subject=Wedlune%20waitlist"
            class="btn-primary"
          >
            {{ $t("footer.waitlist") }}
          </a>
          <NuxtLink
            :to="homeLink('features')"
            class="inline-flex items-center justify-center rounded-full border border-pearl-gray px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            {{ $t("footer.explore") }}
          </NuxtLink>
        </div>
        <p class="text-sm text-warm-gray mt-4">
          {{ $t("footer.comingSoon") }}
        </p>
      </div>

      <!-- Footer links -->
      <div
        class="border-t border-warm-gray/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <img
          src="/img/wedlune-logo-light.png"
          alt="Wedlune"
          class="h-4 w-auto"
          width="142"
          height="28"
        />
        <div class="flex flex-wrap justify-center gap-6 text-sm">
          <NuxtLink
            :to="homeLink('features')"
            class="hover:text-champagne-gold transition-colors"
          >
            {{ $t("nav.features") }}
          </NuxtLink>
          <NuxtLink
            :to="homeLink('pricing')"
            class="hover:text-champagne-gold transition-colors"
          >
            {{ $t("nav.pricing") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/privacy')"
            class="hover:text-champagne-gold transition-colors"
          >
            {{ $t("footer.privacyPolicy") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/terms')"
            class="hover:text-champagne-gold transition-colors"
          >
            {{ $t("footer.terms") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/delete-account')"
            class="hover:text-champagne-gold transition-colors"
          >
            {{ $t("footer.deleteAccount") }}
          </NuxtLink>
        </div>
        <p class="text-sm text-warm-gray">
          {{ $t("footer.rights", { year: new Date().getFullYear() }) }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const homeLink = (id: string) => localePath({ path: "/", hash: `#${id}` });
</script>
