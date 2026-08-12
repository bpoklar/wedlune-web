<template>
  <section class="border-y border-linen bg-white" :aria-label="$t('home.proof.label')">
    <div class="section-shell grid sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(item, index) in items" :key="item.title" class="flex min-h-28 items-start gap-4 border-linen px-2 py-7 sm:px-6 lg:border-l" :class="index === items.length - 1 ? 'lg:border-r' : ''">
        <span class="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-champagne text-sm font-extrabold text-deep-gold" aria-hidden="true">{{ index + 1 }}</span>
        <div>
          <h2 class="text-sm font-extrabold text-charcoal">{{ item.title }}</h2>
          <p class="mt-1 text-sm leading-6 text-warm-gray">{{ item.body }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const items = computed(() => (tm("home.proof.items") as Array<{ title: string; body: string }>).map((item) => ({ title: rt(item.title), body: rt(item.body) })));
</script>
