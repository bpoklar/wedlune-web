<template>
  <section id="how-it-works" v-reveal class="how-section motion-reveal relative isolate overflow-hidden py-20 sm:py-28">
    <div class="section-shell grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
      <div class="relative z-10 max-w-xl">
        <p class="how-kicker section-kicker">{{ $t("home.how.kicker") }}</p>
        <h2 class="how-title section-title">{{ $t("home.how.title") }}</h2>
        <div class="mt-8 aspect-4/3 overflow-hidden rounded-4xl">
          <EditorialPicture
            name="planning-desk"
            :alt="$t('home.how.photoAlt')"
            :width="1440"
            :height="1080"
            sizes="(min-width: 1280px) 392px, (min-width: 1024px) calc(35vw - 56px), (min-width: 640px) 576px, calc(100vw - 40px)"
          />
        </div>
      </div>

      <ol class="how-steps relative grid gap-0">
        <li v-for="(step, index) in steps" :key="step.title" class="how-step relative grid grid-cols-[auto_1fr] gap-5 border-t border-on-inverse/20 py-8 first:border-t-0 first:pt-0 sm:gap-7 sm:py-10">
          <span class="how-number inline-flex h-13 w-13 items-center justify-center rounded-full font-display text-xl" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
          <div>
            <h3 class="font-display text-2xl leading-tight text-on-inverse sm:text-[1.8rem]">{{ step.title }}</h3>
            <p class="mt-3 max-w-lg text-base leading-7 text-inverse-muted">{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const steps = computed(() => (tm("home.how.steps") as Array<{ title: string; description: string }>).map((step) => ({ title: rt(step.title), description: rt(step.description) })));
</script>

<style scoped>
.how-section {
  --site-focus: var(--site-accent);
  color: var(--site-inverse-text);
  background: var(--site-surface-strong);
}

.how-title {
  color: var(--site-inverse-text);
}

.how-kicker {
  color: var(--site-accent);
}

.how-number {
  color: var(--site-accent);
  border: 1px solid var(--site-control-border);
  background: color-mix(in srgb, var(--site-surface) 6%, transparent);
}

@media (min-width: 64rem) {
  .how-steps::before {
    position: absolute;
    left: -2.4rem;
    top: 0;
    width: 1px;
    height: 100%;
    content: "";
    background: var(--site-control-border);
  }
}
</style>
