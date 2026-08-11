<template>
  <section class="soft-page-bg pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
    <div class="section-shell">
      <div class="grid lg:grid-cols-[0.95fr_1.05fr] gap-14 items-center">
        <!-- Text content -->
        <div>
          <p
            class="inline-flex items-center gap-2 rounded-full border border-champagne-gold/30 bg-warm-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-deep-gold mb-6"
          >
            {{ $t("home.hero.badge") }}
          </p>
          <h1
            class="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.04] mb-6"
          >
            {{ $t("home.hero.title") }}
          </h1>
          <p class="text-warm-gray text-lg leading-relaxed mb-8 max-w-lg">
            {{ $t("home.hero.body") }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink
              :to="homeLink('download')"
              class="btn-primary"
            >
              {{ $t("home.hero.primary") }}
            </NuxtLink>
            <NuxtLink
              :to="homeLink('how-it-works')"
              class="btn-secondary"
            >
              {{ $t("home.hero.secondary") }}
            </NuxtLink>
          </div>
          <div
            class="mt-10 grid max-w-lg grid-cols-3 border-y border-linen/80 py-5"
            :aria-label="$t('home.hero.highlights')"
          >
            <div
              v-for="(stat, index) in stats"
              :key="stat.label"
              class="min-w-0 px-5 text-left first:pl-0 last:pr-0"
              :class="index > 0 ? 'border-l border-linen/80' : ''"
            >
              <p class="font-display text-xl leading-none text-charcoal">
                {{ stat.value }}
              </p>
              <p class="mt-2 text-xs leading-tight text-warm-gray">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="relative flex flex-col items-center justify-center"
          role="region"
          :aria-label="$t('home.hero.slider.label')"
          @touchstart.passive="handleTouchStart"
          @touchend.passive="handleTouchEnd"
        >
          <div
            class="absolute -right-12 -top-10 h-56 w-56 rounded-full bg-blush-rose/20 blur-3xl"
          />
          <div
            class="relative w-72 max-w-full rounded-[3rem] border-[10px] border-charcoal bg-charcoal shadow-2xl shadow-champagne-gold/20"
          >
            <div
              class="absolute top-0 left-1/2 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-charcoal"
            />
            <div class="relative aspect-[390/844] overflow-hidden rounded-[2.35rem] bg-ivory-cream">
              <Transition name="phone-slide" mode="out-in">
                <img
                  :key="slides[currentSlide].src"
                  :src="slides[currentSlide].src"
                  :alt="slides[currentSlide].alt"
                  width="780"
                  height="1688"
                  class="absolute inset-0 h-full w-full object-cover"
                  decoding="async"
                  fetchpriority="high"
                >
              </Transition>
            </div>
          </div>

          <p class="mt-5 text-sm font-bold text-deep-gold">
            {{ slides[currentSlide].title }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const stats = computed(() => {
  const messages = tm("home.hero.stats") as Array<{ value: string; label: string }>;
  return messages.map(({ value, label }) => ({
    value: rt(value),
    label: rt(label),
  }));
});
const homeLink = (id: string) => localePath({ path: "/", hash: `#${id}` });

const slides = computed(() => [
  {
    src: "/img/app-screens/home.png",
    alt: t("home.hero.slider.slides.homeAlt"),
    title: t("home.hero.slider.slides.homeTitle"),
  },
  {
    src: "/img/app-screens/budget.png",
    alt: t("home.hero.slider.slides.budgetAlt"),
    title: t("home.hero.slider.slides.budgetTitle"),
  },
  {
    src: "/img/app-screens/guests.png",
    alt: t("home.hero.slider.slides.guestsAlt"),
    title: t("home.hero.slider.slides.guestsTitle"),
  },
]);

const currentSlide = ref(0);
const prefersReducedMotion = ref(false);
let autoplayTimer: ReturnType<typeof setInterval> | undefined;
let motionPreference: MediaQueryList | undefined;
let touchStartX = 0;

const stopAutoplay = () => {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = undefined;
};

const startAutoplay = () => {
  stopAutoplay();
  if (prefersReducedMotion.value) return;
  autoplayTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
  }, 5000);
};

const setSlide = (index: number) => {
  currentSlide.value = (index + slides.value.length) % slides.value.length;
  startAutoplay();
};
const nextSlide = () => setSlide(currentSlide.value + 1);
const previousSlide = () => setSlide(currentSlide.value - 1);

const handleTouchStart = (event: TouchEvent) => {
  touchStartX = event.changedTouches[0]?.clientX ?? 0;
};
const handleTouchEnd = (event: TouchEvent) => {
  const distance = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
  if (Math.abs(distance) < 45) return;
  distance < 0 ? nextSlide() : previousSlide();
};

const handleMotionPreference = (event: MediaQueryListEvent) => {
  prefersReducedMotion.value = event.matches;
};

watch(prefersReducedMotion, startAutoplay);

onMounted(() => {
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = motionPreference.matches;
  motionPreference.addEventListener("change", handleMotionPreference);
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
  motionPreference?.removeEventListener("change", handleMotionPreference);
});
</script>

<style scoped>
.phone-slide-enter-active,
.phone-slide-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.phone-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.phone-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .phone-slide-enter-active,
  .phone-slide-leave-active {
    transition: none;
  }
}
</style>
