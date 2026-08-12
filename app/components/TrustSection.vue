<template>
  <section id="trust" class="py-20 sm:py-28">
    <div class="section-shell">
      <div class="mx-auto max-w-3xl text-center">
        <p class="section-kicker">{{ $t("home.trust.kicker") }}</p>
        <h2 class="section-title mx-auto">{{ $t("home.trust.title") }}</h2>
        <p class="section-subtitle mx-auto mt-6">{{ $t("home.trust.subtitle") }}</p>
      </div>
      <div class="mt-14 grid gap-5 md:grid-cols-3">
        <article v-for="item in items" :key="item.title" class="rounded-4xl border border-linen bg-warm-white p-7 sm:p-8">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage-green/10 text-sage-green" aria-hidden="true">✓</span>
          <h3 class="mt-7 font-display text-2xl text-charcoal">{{ item.title }}</h3>
          <p class="mt-4 text-sm leading-7 text-warm-gray">{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const items = computed(() => (tm("home.trust.items") as Array<{ title: string; description: string }>).map((item) => ({ title: rt(item.title), description: rt(item.description) })));
</script>
