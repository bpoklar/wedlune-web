<template>
  <section id="faq" v-reveal class="motion-reveal bg-ivory-cream py-20 sm:py-28">
    <div class="section-shell grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
      <div>
        <p class="section-kicker">{{ $t("home.faq.kicker") }}</p>
        <h2 class="section-title">{{ $t("home.faq.title") }}</h2>
      </div>
      <div class="divide-y divide-linen border-y border-linen">
        <div v-for="(item, index) in items" :key="item.question" class="faq-item py-2">
          <button
            :id="questionId(index)"
            type="button"
            class="flex min-h-16 w-full cursor-pointer items-center justify-between gap-5 py-4 text-left font-display text-xl text-charcoal"
            :aria-expanded="isOpen(index)"
            :aria-controls="answerId(index)"
            data-faq-toggle
            @click="toggle(index)"
          >
            <span>{{ item.question }}</span>
            <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-linen text-lg transition-transform duration-200" :class="{ 'rotate-45': isOpen(index) }" aria-hidden="true">+</span>
          </button>
          <Transition name="faq-reveal">
            <div
              v-show="isOpen(index)"
              :id="answerId(index)"
              class="faq-answer-reveal"
              role="region"
              :aria-labelledby="questionId(index)"
              data-faq-answer
            >
              <div class="faq-answer">
                <p class="max-w-2xl pb-6 pr-12 text-sm leading-7 text-warm-gray">{{ item.answer }}</p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const faqId = useId();
const openItem = ref<number | null>(null);
const items = computed(() => (tm("home.faq.items") as Array<{ question: string; answer: string }>).map((item) => ({ question: rt(item.question), answer: rt(item.answer) })));

const isOpen = (index: number) => openItem.value === index;
const questionId = (index: number) => `${faqId}-question-${index}`;
const answerId = (index: number) => `${faqId}-answer-${index}`;

const toggle = (index: number) => {
  openItem.value = openItem.value === index ? null : index;
};
</script>

<style scoped>
.faq-answer-reveal {
  display: grid;
  overflow: hidden;
  grid-template-rows: 1fr;
  opacity: 1;
}

.faq-answer {
  min-height: 0;
  overflow: hidden;
}

.faq-reveal-enter-active,
.faq-reveal-leave-active {
  transition:
    grid-template-rows 320ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 200ms ease;
}

.faq-reveal-enter-active .faq-answer,
.faq-reveal-leave-active .faq-answer {
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.faq-reveal-enter-from,
.faq-reveal-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.faq-reveal-enter-from .faq-answer,
.faq-reveal-leave-to .faq-answer {
  transform: translateY(-0.45rem);
}

@media (prefers-reduced-motion: reduce) {
  .faq-reveal-enter-active,
  .faq-reveal-leave-active,
  .faq-reveal-enter-active .faq-answer,
  .faq-reveal-leave-active .faq-answer {
    transition: none;
  }
}
</style>
