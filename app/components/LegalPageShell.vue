<template>
  <div class="section-shell py-12 sm:py-16">
    <header class="mb-12 max-w-3xl">
      <p class="section-kicker">{{ $t("legal.kicker") }}</p>
      <h1 class="font-display text-4xl leading-tight text-charcoal sm:text-5xl">{{ title }}</h1>
      <p class="mt-5 text-sm font-bold text-warm-gray">{{ $t("common.lastUpdated", { date }) }}</p>
    </header>
    <div class="grid items-start gap-12 lg:grid-cols-[15rem_minmax(0,46rem)] lg:gap-16">
      <aside class="card-surface hidden p-6 lg:sticky lg:top-24 lg:block">
        <p class="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-deep-gold">{{ $t("legal.contents") }}</p>
        <nav :aria-label="$t('legal.contents')">
          <ol class="space-y-3 text-sm">
            <li v-for="item in toc" :key="item.id">
              <a :href="`#${item.id}`" class="font-bold leading-snug text-warm-gray hover:text-charcoal">{{ item.label }}</a>
            </li>
          </ol>
        </nav>
      </aside>
      <article class="legal-prose min-w-0">
        <slot />
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  date: string;
  toc: Array<{ id: string; label: string }>;
}>();
</script>
