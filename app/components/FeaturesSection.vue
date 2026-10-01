<template>
  <section id="features" v-reveal class="feature-section motion-reveal overflow-hidden py-20 sm:py-28">
    <div class="section-shell">
      <div class="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
        <div class="max-w-3xl">
          <p class="section-kicker">{{ $t("home.features.kicker") }}</p>
          <h2 class="section-title">{{ $t("home.features.title") }}</h2>
        </div>
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
        <article
          v-for="(feature, index) in features"
          :key="feature.title"
          class="feature-card group relative isolate overflow-hidden rounded-4xl border p-7 sm:p-8"
          :class="featureCardClass(index)"
        >
          <div class="relative z-10" :class="index === 0 ? 'max-w-xs' : index === 1 ? 'max-w-70' : ''">
            <div class="flex items-center">
              <div class="feature-icon flex h-11 w-11 items-center justify-center rounded-2xl" aria-hidden="true">
                <component :is="feature.icon" class="h-6 w-6" />
              </div>
            </div>
            <h3 class="mt-8 font-display text-2xl leading-tight sm:text-[1.7rem]">{{ feature.title }}</h3>
            <p class="mt-4 text-base font-medium leading-7">{{ feature.description }}</p>
          </div>

          <div v-if="index < 2" class="feature-preview" aria-hidden="true">
            <div class="feature-preview-screen">
              <img
                :src="featuredImages[index]"
                alt=""
                :width="index === 0 ? 1280 : 390"
                :height="index === 0 ? 2856 : 844"
                loading="lazy"
                decoding="async"
              >
            </div>
          </div>
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

const featuredImages = [
  "/img/app-screens/real/timeline.png",
  "/img/app-screens/guests-390.png",
] as const;

const featureCardClass = (index: number) => {
  if (index === 0) return "feature-card-primary md:col-span-2 lg:col-span-7 lg:min-h-108";
  if (index === 1) return "feature-card-secondary md:col-span-2 lg:col-span-5 lg:min-h-108";
  return "feature-card-compact lg:col-span-3 lg:min-h-64";
};

const { tm, rt } = useI18n();
const features = computed(() => (tm("home.features.items") as Array<{ title: string; description: string }>).map((item, index) => ({
  icon: definitions[index],
  title: rt(item.title),
  description: rt(item.description),
})));
</script>

<style scoped>
.feature-section {
  background: var(--site-bg);
}

.feature-card {
  color: var(--site-text);
  border-color: var(--site-border);
  background: var(--site-surface);
  box-shadow: none;
}

.feature-icon {
  color: var(--site-accent-strong);
  background: var(--site-bg-soft);
}

.feature-card-secondary {
  background: var(--site-bg-soft);
}

.feature-card p {
  color: var(--site-text-muted);
}

.feature-preview {
  position: absolute;
  right: 1.5rem;
  bottom: -7.5rem;
  z-index: 0;
  width: 14.5rem;
  padding: 0.42rem;
  border-radius: 2rem;
  background: var(--site-surface-strong);
  box-shadow: var(--site-shadow-soft);
  transform: rotate(5deg);
}

.feature-card-secondary .feature-preview {
  right: 1.5rem;
  top: 14rem;
  bottom: auto;
  width: 13.5rem;
  transform: rotate(-4deg);
}

.feature-preview-screen {
  overflow: hidden;
  border-radius: calc(2rem - 0.42rem);
  background: var(--site-surface-strong);
}

.feature-preview img {
  display: block;
  width: 100%;
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .feature-card {
    transition: transform 220ms ease, box-shadow 220ms ease;
  }

  .feature-card:hover {
    transform: translateY(-0.2rem);
    box-shadow: var(--site-shadow-soft);
  }
}

@media (max-width: 63.99rem) {
  .feature-card-primary,
  .feature-card-secondary {
    min-height: 28rem;
  }
}

@media (max-width: 39.99rem) {
  .feature-card-primary,
  .feature-card-secondary {
    min-height: 31rem;
  }

  .feature-preview {
    right: 0.8rem;
    bottom: -8.5rem;
    width: 12rem;
  }

  .feature-card-secondary .feature-preview {
    right: 1rem;
    width: 11.5rem;
  }
}
</style>
