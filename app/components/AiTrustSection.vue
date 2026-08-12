<template>
  <section class="bg-ivory-cream py-20 sm:py-28">
    <div class="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div>
        <p class="section-kicker">{{ $t("home.ai.kicker") }}</p>
        <h2 class="section-title">{{ $t("home.ai.title") }}</h2>
        <p class="section-subtitle mt-6">{{ $t("home.ai.body") }}</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <article v-for="(item, index) in items" :key="item.title" class="card-surface p-6 sm:p-7">
          <span class="font-display text-3xl text-champagne-gold" aria-hidden="true">0{{ index + 1 }}</span>
          <h3 class="mt-8 font-display text-xl text-charcoal">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-7 text-warm-gray">{{ item.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const items = computed(() => (tm("home.ai.items") as Array<{ title: string; body: string }>).map((item) => ({ title: rt(item.title), body: rt(item.body) })));
</script>
