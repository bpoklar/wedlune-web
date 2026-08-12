<template>
  <section id="faq" class="bg-ivory-cream py-20 sm:py-28">
    <div class="section-shell grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
      <div>
        <p class="section-kicker">{{ $t("home.faq.kicker") }}</p>
        <h2 class="section-title">{{ $t("home.faq.title") }}</h2>
        <p class="section-subtitle mt-6">{{ $t("home.faq.body") }}</p>
      </div>
      <div class="divide-y divide-linen border-y border-linen">
        <details v-for="item in items" :key="item.question" class="group py-2">
          <summary class="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 font-display text-xl text-charcoal marker:hidden">
            <span>{{ item.question }}</span>
            <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-linen text-lg transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p class="max-w-2xl pb-6 pr-12 text-sm leading-7 text-warm-gray">{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const items = computed(() => (tm("home.faq.items") as Array<{ question: string; answer: string }>).map((item) => ({ question: rt(item.question), answer: rt(item.answer) })));
</script>
