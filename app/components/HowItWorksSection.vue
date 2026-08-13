<template>
  <section id="how-it-works" v-reveal class="bg-soft-champagne py-20 sm:py-28">
    <div class="section-shell">
      <div class="max-w-3xl">
        <p class="section-kicker">{{ $t("home.how.kicker") }}</p>
        <h2 class="section-title">{{ $t("home.how.title") }}</h2>
      </div>
      <ol class="mt-14 grid gap-5 md:grid-cols-3">
        <li v-for="(step, index) in steps" :key="step.title" class="relative rounded-4xl border border-deep-gold/15 bg-warm-white p-7 sm:p-8">
          <span class="font-display text-5xl text-champagne-gold" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
          <h3 class="mt-8 font-display text-2xl text-charcoal">{{ step.title }}</h3>
          <p class="mt-4 text-sm leading-7 text-warm-gray">{{ step.description }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const steps = computed(() => (tm("home.how.steps") as Array<{ title: string; description: string }>).map((step) => ({ title: rt(step.title), description: rt(step.description) })));
</script>
