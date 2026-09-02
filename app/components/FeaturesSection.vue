<template>
  <section id="features" v-reveal class="feature-section motion-reveal overflow-hidden py-20 sm:py-28">
    <div class="section-shell">
      <div class="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
        <div class="max-w-3xl">
          <p class="section-kicker">{{ $t("home.features.kicker") }}</p>
          <h2 class="section-title">{{ $t("home.features.title") }}</h2>
        </div>
        <RingsMotif size="large" class="feature-rings hidden lg:block" />
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
        <article
          v-for="(feature, index) in features"
          :key="feature.title"
          class="feature-card group relative isolate overflow-hidden rounded-4xl border p-7 sm:p-8"
          :class="featureCardClass(index)"
        >
          <div class="relative z-10" :class="index === 0 ? 'max-w-xs' : index === 1 ? 'max-w-70' : ''">
            <div class="flex items-center justify-between gap-5">
              <div class="feature-icon flex h-11 w-11 items-center justify-center rounded-2xl" aria-hidden="true">
                <component :is="feature.icon" class="h-6 w-6" />
              </div>
              <p class="feature-number text-[0.67rem] font-extrabold uppercase tracking-[0.18em]">{{ String(index + 1).padStart(2, "0") }}</p>
            </div>
            <h3 class="mt-8 font-display text-2xl leading-tight sm:text-[1.7rem]">{{ feature.title }}</h3>
            <p class="mt-4 text-sm leading-7">{{ feature.description }}</p>
          </div>

          <div v-if="index < 2" class="feature-preview" aria-hidden="true">
            <div class="feature-preview-halo" />
            <img
              :src="featuredImages[index]"
              alt=""
              :width="index === 0 ? 1280 : 390"
              :height="index === 0 ? 2856 : 844"
              loading="lazy"
              decoding="async"
            >
          </div>

          <RingsMotif v-else size="medium" class="feature-card-rings" />
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
  background:
    radial-gradient(circle at 98% 20%, rgb(181 150 114 / 0.1), transparent 22rem),
    var(--site-bg);
}

.feature-rings {
  margin-right: 1.5rem;
  color: rgb(152 114 77 / 0.42);
  transform: rotate(-7deg);
}

.feature-card {
  color: var(--site-text);
  border-color: var(--site-border);
  background: white;
  box-shadow: var(--site-shadow-soft);
}

.feature-card-primary {
  color: white;
  border-color: rgb(255 255 255 / 0.08);
  background:
    radial-gradient(circle at 92% 10%, rgb(181 150 114 / 0.22), transparent 18rem),
    linear-gradient(145deg, #241f1b, #322820);
}

.feature-card-secondary {
  background:
    radial-gradient(circle at 100% 100%, rgb(181 150 114 / 0.22), transparent 18rem),
    #f6ede2;
}

.feature-card-primary .feature-icon {
  color: #f2d8a8;
  background: rgb(255 255 255 / 0.08);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1);
}

.feature-card-primary .feature-number,
.feature-card-primary p {
  color: rgb(255 255 255 / 0.68);
}

.feature-card-secondary .feature-icon,
.feature-card-compact .feature-icon {
  color: var(--site-accent-strong);
  background: var(--color-soft-champagne);
}

.feature-card-secondary .feature-number,
.feature-card-compact .feature-number {
  color: var(--site-text-muted);
}

.feature-card-secondary p,
.feature-card-compact p {
  color: var(--site-text-muted);
}

.feature-preview {
  position: absolute;
  right: 1.5rem;
  bottom: -7.5rem;
  z-index: 0;
  width: 14.5rem;
  transform: rotate(5deg);
}

.feature-card-secondary .feature-preview {
  right: -0.5rem;
  bottom: -9.5rem;
  width: 13.5rem;
  transform: rotate(-4deg);
}

.feature-preview img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  border: 0.42rem solid #1e1a1c;
  border-radius: 2rem;
  box-shadow: 0 25px 55px rgb(22 18 20 / 0.34);
}

.feature-card-secondary .feature-preview img {
  border-color: #f9f6f2;
  box-shadow: 0 25px 55px rgb(78 57 45 / 0.19);
}

.feature-preview-halo {
  position: absolute;
  left: -4rem;
  top: -3rem;
  width: 17rem;
  height: 17rem;
  border: 1px solid rgb(255 255 255 / 0.16);
  border-radius: 999px;
}

.feature-card-secondary .feature-preview-halo {
  border-color: rgb(152 114 77 / 0.2);
}

.feature-card-rings {
  position: absolute;
  right: -1.5rem;
  bottom: -0.75rem;
  color: rgb(152 114 77 / 0.22);
  transform: rotate(-8deg);
  transition: transform 260ms ease;
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .feature-card {
    transition: transform 220ms ease, box-shadow 220ms ease;
  }

  .feature-card:hover {
    transform: translateY(-0.2rem);
    box-shadow: 0 25px 65px rgb(36 31 27 / 0.12);
  }

  .feature-card:hover .feature-card-rings {
    transform: translate(-0.25rem, -0.2rem) rotate(-4deg);
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
    opacity: 0.94;
  }

  .feature-card-secondary .feature-preview {
    right: -0.25rem;
    bottom: -10.5rem;
    width: 11.5rem;
  }
}
</style>
