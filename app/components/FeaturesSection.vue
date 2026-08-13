<template>
  <section id="features" v-reveal class="py-20 sm:py-28">
    <div class="section-shell">
      <div class="max-w-3xl">
        <p class="section-kicker">{{ $t("home.features.kicker") }}</p>
        <h2 class="section-title">{{ $t("home.features.title") }}</h2>
      </div>

      <div class="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
        <article
          v-for="(feature, index) in features"
          :key="feature.title"
          class="group card-surface relative overflow-hidden p-7 sm:p-8"
          :class="index < 2 ? 'lg:col-span-6 lg:min-h-84' : 'lg:col-span-3'"
        >
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-soft-champagne text-deep-gold" aria-hidden="true">
            <component :is="feature.icon" class="h-6 w-6" />
          </div>
          <p class="mt-9 text-xs font-extrabold uppercase tracking-[0.15em] text-pearl-gray">{{ String(index + 1).padStart(2, "0") }}</p>
          <h3 class="mt-3 font-display text-2xl leading-tight text-charcoal">{{ feature.title }}</h3>
          <p class="mt-4 text-sm leading-7 text-warm-gray">{{ feature.description }}</p>
          <div v-if="index < 2" class="absolute -bottom-14 -right-14 h-40 w-40 rounded-full bg-sand-beige/20 transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2" aria-hidden="true" />
        </article>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, h } from "vue";

const makeIcon = (path: string) => defineComponent({
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h("svg", { ...attrs, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true" }, [
      h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.8", d: path }),
    ]);
  },
});

const definitions = [
  makeIcon("M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"),
  makeIcon("M16 11a4 4 0 1 0-8 0m8 0a4 4 0 0 1-8 0m8 0c2.5.8 4 2.5 4 5v1H4v-1c0-2.5 1.5-4.2 4-5"),
  makeIcon("M12 6v12m4-8c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 2.4 4 2.4 4 .7 4 2.3-1.8 3-4 3-4-1.3-4-3"),
  makeIcon("M7 8h10M7 12h10M9 16h6M5 4h14v16H5z"),
  makeIcon("M4 8h4l1.5-2h5L16 8h4v11H4V8Zm8 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"),
  makeIcon("m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 11 .9 2.6 2.6.9-2.6.9L18 21l-.9-2.6-2.6-.9 2.6-.9L18 14Z"),
];

const { tm, rt } = useI18n();
const features = computed(() => (tm("home.features.items") as Array<{ title: string; description: string }>).map((item, index) => ({
  icon: definitions[index],
  title: rt(item.title),
  description: rt(item.description),
})));
</script>
