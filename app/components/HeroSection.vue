<template>
  <section v-reveal class="soft-page-bg overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32 lg:min-h-204 lg:pb-28 lg:pt-36">
    <div class="section-shell grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
      <div class="relative z-10 max-w-2xl">
        <p class="section-kicker">{{ $t("home.hero.badge") }}</p>
        <h1 class="font-display text-[2.85rem] leading-[1.02] tracking-tight text-charcoal sm:text-6xl lg:text-[4.7rem]">
          {{ $t("home.hero.title") }}
        </h1>
        <p class="mt-7 max-w-xl text-lg leading-8 text-warm-gray sm:text-xl sm:leading-9">
          {{ $t("home.hero.body") }}
        </p>
        <div class="mt-9">
          <AppStoreCtas />
        </div>
        <a :href="homeLink('how-it-works')" class="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-deep-gold hover:text-charcoal">
          {{ $t("home.hero.secondary") }}
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div class="relative min-h-136 sm:min-h-168" :aria-label="$t('home.hero.slider.label')">
        <div class="absolute inset-x-8 top-0 h-124 overflow-hidden rounded-[2.5rem] shadow-2xl sm:inset-x-12 sm:h-152 lg:inset-x-0 lg:left-16">
          <EditorialPicture name="rings" :alt="$t('home.hero.photoAlt')" :width="1440" :height="1800" eager sizes="(min-width: 1024px) 42vw, 85vw" />
          <div class="absolute inset-0 bg-linear-to-t from-charcoal/20 via-transparent to-white/5" />
        </div>

        <div class="absolute bottom-0 left-0 w-54 rounded-[2.4rem] border-8 border-charcoal bg-charcoal shadow-2xl sm:left-4 sm:w-[16rem] lg:-left-3">
          <div class="absolute left-1/2 top-0 z-20 h-5 w-20 -translate-x-1/2 rounded-b-xl bg-charcoal" />
          <div class="relative aspect-390/844 overflow-hidden rounded-[1.9rem] bg-ivory-cream">
            <Transition name="preview-fade" mode="out-in">
              <img
                :key="activeSlide.src"
                :src="activeSlide.src"
                :alt="activeSlide.alt"
                width="390"
                height="844"
                decoding="async"
                fetchpriority="high"
                class="absolute inset-0 h-full w-full object-cover"
              >
            </Transition>
          </div>
        </div>

        <div class="absolute bottom-3 right-0 max-w-56 rounded-2xl border border-linen bg-white/95 p-3 shadow-xl backdrop-blur sm:bottom-7 sm:right-2 sm:max-w-xs sm:p-4">
          <p class="text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-deep-gold">{{ $t("home.hero.previewLabel") }}</p>
          <div class="mt-3 flex flex-wrap gap-2" role="group" :aria-label="$t('home.hero.slider.label')">
            <button
              v-for="(slide, index) in slides"
              :key="slide.src"
              type="button"
              class="min-h-10 rounded-full px-3 text-xs font-extrabold transition-colors"
              :class="currentSlide === index ? 'bg-charcoal text-white' : 'bg-soft-champagne text-charcoal hover:bg-linen'"
              :aria-pressed="currentSlide === index"
              @click="currentSlide = index"
            >
              {{ slide.shortTitle }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const homeLink = (id: string) => localePath({ path: "/", hash: `#${id}` });

type HeroSlide = {
  src: string;
  alt: string;
  shortTitle: string;
};

const slides = computed<[HeroSlide, ...HeroSlide[]]>(() => [
  { src: "/img/app-screens/home-390.png", alt: t("home.hero.slider.slides.homeAlt"), shortTitle: t("home.hero.slider.slides.homeShort") },
  { src: "/img/app-screens/budget-390.png", alt: t("home.hero.slider.slides.budgetAlt"), shortTitle: t("home.hero.slider.slides.budgetShort") },
  { src: "/img/app-screens/guests-390.png", alt: t("home.hero.slider.slides.guestsAlt"), shortTitle: t("home.hero.slider.slides.guestsShort") },
]);
const currentSlide = ref(0);
const activeSlide = computed(
  () => slides.value[currentSlide.value] ?? slides.value[0],
);
</script>

<style scoped>
.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 180ms ease;
}
.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}
</style>
