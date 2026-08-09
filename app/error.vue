<template>
  <div>
    <NuxtLayout>
      <div class="min-h-screen flex items-center justify-center px-4 py-16">
        <div class="text-center max-w-lg">
          <div v-if="error?.statusCode === 404" class="space-y-6">
            <h1 class="font-display text-6xl text-champagne-gold">404</h1>
            <h2 class="font-display text-2xl text-charcoal">
              {{ $t("error.notFound") }}
            </h2>
            <p class="text-warm-gray text-sm">
              {{ $t("error.notFoundBody") }}
            </p>
          </div>
          <div v-else class="space-y-6">
            <h1 class="font-display text-6xl text-champagne-gold">{{ $t("error.oops") }}</h1>
            <h2 class="font-display text-2xl text-charcoal">
              {{ $t("error.title") }}
            </h2>
            <p class="text-warm-gray text-sm">
              {{ error?.message || error?.statusMessage || $t("error.body") }}
            </p>
          </div>
          <NuxtLink
            :to="localePath('/')"
            class="inline-block mt-8 bg-champagne-gold text-white px-8 py-3 rounded-full font-bold hover:bg-deep-gold transition-colors"
          >
            {{ $t("common.goHome") }}
          </NuxtLink>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const error = useError();
const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => error.value?.statusCode === 404 ? t("error.notFoundSeo") : t("error.seo"),
  robots: "noindex",
});
</script>
