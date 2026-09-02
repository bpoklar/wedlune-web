<template>
  <section id="how-it-works" v-reveal class="how-section motion-reveal relative isolate overflow-hidden py-20 sm:py-28">
    <RingsMotif size="xl" class="how-rings" />
    <div class="section-shell grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
      <div class="relative z-10 max-w-xl">
        <p class="how-kicker section-kicker">{{ $t("home.how.kicker") }}</p>
        <h2 class="how-title section-title">{{ $t("home.how.title") }}</h2>
        <div class="mt-8 hidden items-center gap-3 lg:flex" aria-hidden="true">
          <span class="h-px w-20 bg-white/25" />
          <span class="text-soft-champagne">✦</span>
        </div>
      </div>

      <ol class="how-steps relative grid gap-0">
        <li v-for="(step, index) in steps" :key="step.title" class="how-step relative grid grid-cols-[auto_1fr] gap-5 border-t border-white/12 py-8 first:border-t-0 first:pt-0 sm:gap-7 sm:py-10">
          <span class="how-number inline-flex h-13 w-13 items-center justify-center rounded-full font-display text-xl" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
          <div>
            <h3 class="font-display text-2xl leading-tight text-white sm:text-[1.8rem]">{{ step.title }}</h3>
            <p class="mt-3 max-w-lg text-sm leading-7 text-white/62 sm:text-base">{{ step.description }}</p>
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
  color: white;
  background:
    radial-gradient(circle at 8% 110%, rgb(181 150 114 / 0.2), transparent 28rem),
    radial-gradient(circle at 92% -20%, rgb(181 150 114 / 0.15), transparent 30rem),
    var(--site-surface-strong);
}

.how-section::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: "";
  opacity: 0.3;
  background-image: radial-gradient(rgb(255 255 255 / 0.36) 0.7px, transparent 0.7px);
  background-size: 28px 28px;
  mask-image: linear-gradient(90deg, black, transparent 45%);
}

.how-kicker {
  color: #e2c18b;
}

.how-title {
  color: white;
}

.how-number {
  color: #f0d9b4;
  border: 1px solid rgb(226 193 139 / 0.34);
  background: rgb(255 255 255 / 0.04);
  box-shadow: inset 0 0 0 0.35rem rgb(255 255 255 / 0.025);
}

.how-rings {
  position: absolute;
  left: -7rem;
  bottom: -7rem;
  z-index: -1;
  width: 30rem;
  height: 19rem;
  color: rgb(226 193 139 / 0.12);
  transform: rotate(-8deg);
}

@media (min-width: 64rem) {
  .how-steps::before {
    position: absolute;
    left: -2.4rem;
    top: 0;
    width: 1px;
    height: 100%;
    content: "";
    background: linear-gradient(transparent, rgb(255 255 255 / 0.18), transparent);
  }
}
</style>
