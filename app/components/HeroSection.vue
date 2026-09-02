<template>
  <section
    v-reveal
    class="hero-section motion-reveal soft-page-bg relative isolate overflow-hidden pb-18 pt-27 sm:pb-24 sm:pt-32 lg:min-h-204 lg:pb-28 lg:pt-36"
  >
    <RingsMotif size="xl" class="hero-rings hero-rings-large" />
    <RingsMotif size="medium" class="hero-rings hero-rings-small" />

    <div
      class="section-shell grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16"
    >
      <div class="relative z-10 max-w-2xl">
        <p class="section-kicker inline-flex items-center gap-2">
          <RingsMotif size="small" class="hero-kicker-rings" />
          {{ $t("home.hero.badge") }}
        </p>
        <h1
          class="font-display text-[2.85rem] leading-[1.02] tracking-tight text-charcoal sm:text-6xl lg:text-[4.7rem]"
        >
          {{ $t("home.hero.title") }}
        </h1>
        <p
          class="mt-7 max-w-xl text-lg leading-8 text-warm-gray sm:text-xl sm:leading-9"
        >
          {{ $t("home.hero.body") }}
        </p>
        <div class="mt-9">
          <AppStoreCtas />
        </div>
        <a
          :href="homeLink('how-it-works')"
          class="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-deep-gold hover:text-charcoal"
        >
          {{ $t("home.hero.secondary") }}
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div
        class="hero-visual relative min-h-132 sm:min-h-168"
        :aria-label="$t('home.hero.slider.label')"
        @mouseenter="pauseSlider"
        @mouseleave="resumeSlider"
        @focusin="pauseSlider"
        @focusout="resumeSlider"
      >
        <div
          class="hero-photo absolute inset-x-7 top-0 h-120 overflow-hidden rounded-[2.25rem] shadow-2xl sm:inset-x-12 sm:h-152 sm:rounded-[2.75rem] lg:inset-x-0 lg:left-16"
        >
          <EditorialPicture
            name="rings"
            :alt="$t('home.hero.photoAlt')"
            :width="1440"
            :height="1800"
            eager
            sizes="(min-width: 1024px) 42vw, 85vw"
          />
          <div
            class="absolute inset-0 bg-linear-to-t from-charcoal/35 via-charcoal/5 to-white/5"
          />
        </div>

        <div
          class="phone-shell absolute bottom-0 left-0 z-10 w-54 rounded-[2.4rem] p-[0.42rem] sm:left-4 sm:w-[16rem] lg:-left-3"
        >
          <div
            class="phone-screen relative aspect-1280/2856 overflow-hidden rounded-[1.9rem] bg-charcoal"
          >
            <Transition name="preview-fade" mode="out-in">
              <img
                :key="activeSlide.src"
                :src="activeSlide.src"
                :alt="activeSlide.alt"
                width="1280"
                height="2856"
                decoding="async"
                fetchpriority="high"
                class="absolute inset-0 h-full w-full object-cover"
              />
            </Transition>
          </div>
        </div>

        <div class="hero-screen-label absolute bottom-7 right-0 z-20 sm:bottom-11 sm:right-4">
          <span class="hero-screen-spark" aria-hidden="true">✦</span>
          <Transition name="preview-fade" mode="out-in">
            <span :key="activeSlide.title">{{ activeSlide.title }}</span>
          </Transition>
        </div>

        <div
          class="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col items-center gap-0.5 rounded-full bg-charcoal/75 p-1.5 shadow-lg backdrop-blur-sm sm:right-7"
          role="group"
          :aria-label="$t('home.hero.slider.label')"
        >
          <button
            v-for="(slide, index) in slides"
            :key="slide.src"
            type="button"
            class="group/slide flex h-8 w-8 items-center justify-center rounded-full"
            :aria-label="$t('home.hero.slider.show', { screen: slide.title })"
            :aria-pressed="currentSlide === index"
            data-hero-slide
            @click="selectSlide(index)"
          >
            <span
              class="h-2 rounded-full transition-[width,background-color]"
              :class="
                currentSlide === index
                  ? 'w-5 bg-white'
                  : 'w-2 bg-white/45 group-hover/slide:bg-white/75'
              "
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
const homeLink = (id: string) => localePath({ path: "/", hash: `#${id}` });

const slideDefinitions = [
  ["timeline", "/img/app-screens/real/timeline.png"],
  ["venue", "/img/app-screens/real/venue.png"],
  ["budget", "/img/app-screens/real/budget.png"],
  ["vendors", "/img/app-screens/real/vendors.png"],
  ["caterers", "/img/app-screens/real/caterers.png"],
  ["attire", "/img/app-screens/real/attire.png"],
  ["transport", "/img/app-screens/real/transport.png"],
] as const;

const slides = computed(() =>
  slideDefinitions.map(([key, src]) => ({
    src,
    title: t(`home.hero.slider.slides.${key}.title`),
    alt: t(`home.hero.slider.slides.${key}.alt`),
  })),
);
const currentSlide = ref(0);
const activeSlide = computed(
  () => slides.value[currentSlide.value] ?? slides.value[0]!,
);
let slideTimer: ReturnType<typeof setInterval> | undefined;

const pauseSlider = () => {
  if (!slideTimer) return;
  clearInterval(slideTimer);
  slideTimer = undefined;
};

const resumeSlider = () => {
  pauseSlider();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  slideTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
  }, 4500);
};

const selectSlide = (index: number) => {
  currentSlide.value = index;
};

onMounted(() => {
  resumeSlider();
});
onBeforeUnmount(pauseSlider);
</script>

<style scoped>
.hero-rings {
  position: absolute;
  z-index: -1;
  color: rgb(152 114 77 / 0.18);
  pointer-events: none;
}

.hero-rings-large {
  right: -9rem;
  top: -4rem;
  width: 34rem;
  height: 22rem;
  transform: rotate(-7deg);
}

.hero-rings-small {
  left: -1.75rem;
  bottom: 2rem;
  color: rgb(152 114 77 / 0.22);
  transform: rotate(8deg);
}

.hero-kicker-rings {
  color: var(--site-accent);
}

.hero-photo::after {
  position: absolute;
  inset: 1rem;
  border: 1px solid rgb(255 255 255 / 0.38);
  border-radius: 1.65rem;
  content: "";
  pointer-events: none;
}

.hero-screen-label {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid rgb(255 255 255 / 0.5);
  border-radius: 999px;
  padding: 0.65rem 0.95rem;
  font-size: 0.75rem;
  font-weight: 900;
  color: white;
  background: rgb(36 31 27 / 0.9);
  box-shadow: 0 14px 34px rgb(36 31 27 / 0.2);
  backdrop-filter: blur(12px);
}

.hero-screen-spark {
  color: #e2c18b;
}

.phone-shell {
  background: linear-gradient(
    112deg,
    #747b80 0%,
    #e9ecee 15%,
    #aeb4b8 34%,
    #f8f9f9 51%,
    #9aa1a6 72%,
    #dfe3e5 88%,
    #777e83 100%
  );
  box-shadow:
    0 30px 60px rgb(36 31 27 / 0.3),
    inset 0 0 0 1px rgb(255 255 255 / 0.78),
    inset 0 0 0 2px rgb(74 80 84 / 0.5);
}

.phone-shell::after {
  position: absolute;
  inset: 0.18rem;
  border: 1px solid rgb(255 255 255 / 0.48);
  border-radius: 2.2rem;
  content: "";
  pointer-events: none;
}

.phone-screen {
  border: 2px solid #17191a;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.45);
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 180ms ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}

@media (max-width: 39.99rem) {
  .hero-screen-label {
    right: -0.25rem;
  }

  .hero-rings-large { right: -14rem; top: 1rem; }
}
</style>
