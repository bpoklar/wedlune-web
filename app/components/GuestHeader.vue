<template>
  <header class="border-b border-linen/80 bg-warm-white/95">
    <div class="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
      <img src="/img/wedlune-logo-dark-284.png" alt="Wedlune" width="142" height="29" class="h-6 w-auto">
      <nav class="flex items-center gap-1" :aria-label="$t('nav.language')">
        <NuxtLink
          v-for="option in localeOptions"
          :key="option.code"
          :to="switchTo(option.code)"
          class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-xs font-extrabold transition-colors"
          :class="locale === option.code ? 'bg-charcoal text-white' : 'text-warm-gray hover:bg-soft-champagne hover:text-charcoal'"
          :lang="option.code"
          :aria-current="locale === option.code ? 'page' : undefined"
        >
          {{ option.short }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n();
type SupportedLocale = "en" | "sl";
const localeOptions = [
  { code: "en", short: "EN" },
  { code: "sl", short: "SL" },
] as const;
const switchTo = (code: SupportedLocale) => ({
  path: switchLocalePath(code),
  query: route.query,
  hash: route.hash,
});
</script>
