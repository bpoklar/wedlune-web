<template>
  <section v-reveal class="border-y border-linen bg-white" :aria-label="$t('home.proof.label')">
    <div class="section-shell grid grid-cols-2 lg:grid-cols-4">
      <div v-for="(item, index) in items" :key="item" class="flex min-h-20 items-center gap-3 border-linen px-2 py-5 sm:px-6 lg:border-l" :class="index === items.length - 1 ? 'lg:border-r' : ''">
        <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-champagne text-sm font-extrabold text-deep-gold" aria-hidden="true">{{ index + 1 }}</span>
        <p class="text-sm font-extrabold leading-5 text-charcoal">{{ item }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const items = computed(() => (tm("home.proof.items") as string[]).map((item) => rt(item)));
</script>
