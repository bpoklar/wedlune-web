<template>
  <section class="bg-charcoal py-20 text-white sm:py-28">
    <div class="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div class="lg:sticky lg:top-28 lg:self-start">
        <p class="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-soft-champagne">{{ $t("home.problem.kicker") }}</p>
        <h2 class="max-w-xl font-display text-4xl leading-[1.08] sm:text-5xl">{{ $t("home.problem.title") }}</h2>
        <p class="mt-6 max-w-lg text-base leading-8 text-white/70 sm:text-lg">{{ $t("home.problem.body") }}</p>
      </div>
      <div class="space-y-4">
        <article v-for="(item, index) in items" :key="item.title" class="rounded-[2rem] border border-white/15 bg-white/[0.05] p-6 sm:p-8">
          <div class="flex items-start gap-5">
            <span class="font-display text-3xl text-soft-champagne" aria-hidden="true">0{{ index + 1 }}</span>
            <div>
              <h3 class="font-display text-2xl">{{ item.title }}</h3>
              <p class="mt-3 leading-7 text-white/70">{{ item.body }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const items = computed(() => (tm("home.problem.items") as Array<{ title: string; body: string }>).map((item) => ({ title: rt(item.title), body: rt(item.body) })));
</script>
