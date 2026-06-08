<template>
  <div>
    <NuxtLayout>
      <div class="min-h-screen flex items-center justify-center px-4 py-16">
        <div class="text-center max-w-lg">
          <div v-if="error?.statusCode === 404" class="space-y-6">
            <h1 class="font-display text-6xl text-champagne-gold">404</h1>
            <h2 class="font-display text-2xl text-charcoal">
              Page Not Found
            </h2>
            <p class="text-warm-gray text-sm">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div v-else class="space-y-6">
            <h1 class="font-display text-6xl text-champagne-gold">Oops</h1>
            <h2 class="font-display text-2xl text-charcoal">
              Something went wrong
            </h2>
            <p class="text-warm-gray text-sm">
              {{ error?.message || error?.statusMessage || "An unexpected error occurred." }}
            </p>
          </div>
          <NuxtLink
            to="/"
            class="inline-block mt-8 bg-champagne-gold text-white px-8 py-3 rounded-full font-bold hover:bg-deep-gold transition-colors"
          >
            Go Home
          </NuxtLink>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const error = useError();

useSeoMeta({
  title: error.value?.statusCode === 404
    ? "Page Not Found — Wedlune"
    : "Error — Wedlune",
  robots: "noindex",
});
</script>
