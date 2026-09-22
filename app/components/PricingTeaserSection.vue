<template>
  <section id="pricing" v-reveal class="motion-reveal comparison-section relative isolate overflow-hidden py-20 sm:py-28" :aria-labelledby="comparisonTitleId">
    <RingsMotif size="xl" class="pricing-rings" />
    <div class="section-shell">
      <div class="mx-auto max-w-3xl text-center">
        <p class="section-kicker">{{ $t("home.pricing.kicker") }}</p>
        <h2 :id="comparisonTitleId" class="section-title">{{ $t("home.pricing.title") }}</h2>
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-2">
        <article class="plan-summary plan-summary-free">
          <div class="flex items-center justify-between gap-5">
            <p class="plan-eyebrow">{{ $t("home.pricing.free") }}</p>
            <RingsMotif size="small" class="plan-symbol" />
          </div>
          <h3>{{ $t("home.pricing.freeTitle") }}</h3>
          <p>{{ $t("home.pricing.freeSubtitle") }}</p>
          <ul>
            <li v-for="item in freeItems" :key="item"><span aria-hidden="true">✓</span>{{ item }}</li>
          </ul>
        </article>

        <article class="plan-summary plan-summary-premium">
          <div class="flex items-center justify-between gap-5">
            <p class="plan-eyebrow">{{ $t("home.pricing.premium") }}</p>
            <RingsMotif size="small" class="plan-symbol plan-symbol-premium" />
          </div>
          <h3>{{ $t("home.pricing.premiumTitle") }}</h3>
          <p>{{ $t("home.pricing.premiumSubtitle") }}</p>
          <ul>
            <li v-for="item in premiumItems" :key="item"><span aria-hidden="true">✓</span>{{ item }}</li>
          </ul>
        </article>
      </div>

      <div class="comparison-disclosure">
        <button
          type="button"
          class="comparison-toggle"
          data-full-comparison-toggle
          :aria-expanded="showFullComparison"
          :aria-controls="fullComparisonPanelId"
          @click="toggleFullComparison"
        >
          <span>{{ $t(showFullComparison ? "home.pricing.hideComparison" : "home.pricing.compareAll") }}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" :class="showFullComparison ? 'rotate-180' : ''">
            <path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <Transition name="comparison-reveal" @after-leave="resetComparisonGroups">
          <div
            v-show="showFullComparison"
            :id="fullComparisonPanelId"
            class="full-comparison-reveal"
            :class="{ 'is-revealed': showFullComparison }"
            data-full-comparison
          >
            <div class="full-comparison-clip">
              <div class="full-comparison">
                <div
                  v-for="group in planComparisonGroups"
                  :key="group.id"
                  class="comparison-accordion"
                  :data-comparison-group="group.id"
                  :data-open="isGroupOpen(group.id)"
                >
                  <button
                    :id="`${fullComparisonPanelId}-${group.id}-toggle`"
                    type="button"
                    class="comparison-group-toggle"
                    :aria-expanded="isGroupOpen(group.id)"
                    :aria-controls="`${fullComparisonPanelId}-${group.id}`"
                    @click="toggleGroup(group.id)"
                  >
                    <span>
                      <strong>{{ $t(group.titleKey) }}</strong>
                      <small>{{ $t("home.pricing.featureCount", { count: group.rows.length }) }}</small>
                    </span>
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                      <path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>

                  <Transition name="comparison-group" @after-enter="onGroupOpened(group.id, $event)">
                    <div
                      v-show="isGroupOpen(group.id)"
                      :id="`${fullComparisonPanelId}-${group.id}`"
                      class="accordion-reveal"
                      role="region"
                      :aria-labelledby="`${fullComparisonPanelId}-${group.id}-toggle`"
                      :inert="!isGroupOpen(group.id)"
                    >
                      <div class="accordion-clip">
                        <div class="accordion-content">
                          <table class="comparison-table hidden md:table">
                            <caption class="sr-only">{{ $t("home.pricing.groupCaption", { group: $t(group.titleKey) }) }}</caption>
                            <thead>
                              <tr>
                                <th scope="col">{{ $t("home.pricing.feature") }}</th>
                                <th scope="col">{{ $t("home.pricing.free") }}</th>
                                <th scope="col" class="premium-column">{{ $t("home.pricing.premium") }}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="comparisonRow in group.rows" :key="comparisonRow.id" :data-comparison-row="comparisonRow.id">
                                <th scope="row">{{ $t(comparisonRow.labelKey) }}</th>
                                <td><PlanComparisonValue :value="comparisonRow.free" /></td>
                                <td class="premium-column"><PlanComparisonValue :value="comparisonRow.premium" /></td>
                              </tr>
                            </tbody>
                          </table>

                          <dl class="comparison-mobile md:hidden">
                            <div v-for="comparisonRow in group.rows" :key="comparisonRow.id" class="mobile-row" :data-comparison-row="comparisonRow.id">
                              <dt>{{ $t(comparisonRow.labelKey) }}</dt>
                              <dd>
                                <span class="mobile-plan-label">{{ $t("home.pricing.free") }}</span>
                                <PlanComparisonValue :value="comparisonRow.free" />
                              </dd>
                              <dd class="mobile-premium-value">
                                <span class="mobile-plan-label">{{ $t("home.pricing.premium") }}</span>
                                <PlanComparisonValue :value="comparisonRow.premium" />
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="comparison-cta">
        <p class="plan-eyebrow">{{ $t("home.pricing.storeKicker") }}</p>
        <h3>{{ $t("home.pricing.storeTitle") }}</h3>
        <p>{{ $t("home.pricing.storeNote") }}</p>
        <AppStoreCtas centered class="mt-6" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  planComparisonGroups,
} from "~/data/planComparison";

const { tm, rt } = useI18n();
const comparisonTitleId = useId();
const fullComparisonPanelId = useId();
const showFullComparison = ref(false);
const openGroups = ref<Set<string>>(new Set());
const pendingScrollGroup = ref<string | null>(null);

const resolveList = (key: string) => (tm(key) as string[]).map((item) => rt(item));
const freeItems = computed(() => resolveList("home.pricing.freeItems"));
const premiumItems = computed(() => resolveList("home.pricing.premiumItems"));

const isGroupOpen = (id: string) => openGroups.value.has(id);

const toggleFullComparison = () => {
  showFullComparison.value = !showFullComparison.value;
};

const resetComparisonGroups = () => {
  if (showFullComparison.value) return;
  openGroups.value = new Set();
  pendingScrollGroup.value = null;
};

const toggleGroup = (id: string) => {
  const wasOpen = isGroupOpen(id);
  pendingScrollGroup.value = !wasOpen && openGroups.value.size > 0 ? id : null;
  openGroups.value = wasOpen ? new Set() : new Set([id]);
};

const onGroupOpened = (id: string, element: Element) => {
  if (pendingScrollGroup.value !== id || !isGroupOpen(id) || !showFullComparison.value) return;
  pendingScrollGroup.value = null;
  element.closest<HTMLElement>("[data-comparison-group]")?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
};
</script>

<style scoped>
.comparison-section {
  background:
    radial-gradient(circle at 4% 35%, color-mix(in srgb, var(--site-accent) 12%, transparent), transparent 24rem),
    linear-gradient(180deg, var(--site-bg), var(--site-bg-soft));
}

.pricing-rings {
  position: absolute;
  right: -8rem;
  top: 2rem;
  z-index: -1;
  color: color-mix(in srgb, var(--site-accent) 14%, transparent);
  transform: rotate(8deg);
}

.plan-summary {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--site-border);
  border-radius: 1.5rem;
  padding: 2rem;
}

.plan-summary-free {
  background: color-mix(in srgb, var(--site-surface) 86%, transparent);
  backdrop-filter: blur(10px);
}

.plan-summary-premium {
  border-color: var(--site-accent);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--site-accent) 20%, transparent), transparent 15rem),
    var(--site-bg-soft);
  box-shadow: 0 22px 55px color-mix(in srgb, var(--site-text) 10%, transparent);
}

.plan-summary-premium::after {
  position: absolute;
  right: -4.5rem;
  bottom: -5rem;
  width: 10rem;
  height: 10rem;
  border: 1px solid color-mix(in srgb, var(--site-accent) 14%, transparent);
  border-radius: 999px;
  content: "";
}

.plan-symbol {
  color: color-mix(in srgb, var(--site-accent) 42%, transparent);
}

.plan-symbol-premium {
  color: var(--site-accent-strong);
}

.plan-eyebrow {
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--site-accent-strong);
}

.plan-summary h3,
.comparison-cta h3 {
  margin-top: 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.35rem);
  line-height: 1.15;
}

.plan-summary > p:not(.plan-eyebrow) {
  margin-top: 0.75rem;
  line-height: 1.7;
  color: var(--site-text-muted);
}

.plan-summary ul {
  display: grid;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.plan-summary li {
  display: flex;
  gap: 0.65rem;
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.55;
}

.plan-summary li span {
  color: var(--site-success);
}

.comparison-accordion {
  overflow: hidden;
  border: 1px solid var(--site-border);
  border-radius: 1.5rem;
  background: var(--site-surface);
  box-shadow: 0 18px 50px color-mix(in srgb, var(--site-text) 6%, transparent);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.comparison-table th,
.comparison-table td {
  border-bottom: 1px solid var(--site-border);
  padding: 1rem 1.25rem;
  text-align: left;
  vertical-align: top;
}

.comparison-table thead th {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--site-text-muted);
  background: var(--site-bg-soft);
}

.comparison-table thead th:first-child,
.comparison-table tbody th[scope="row"] {
  width: 46%;
}

.comparison-table tbody th[scope="row"] {
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.5;
}

.comparison-table .premium-column {
  background: var(--site-bg);
}

.comparison-table thead .premium-column {
  color: var(--site-accent-strong);
  background: var(--site-bg-soft);
}

.comparison-table tbody tr:last-child > * {
  border-bottom: 0;
}

.comparison-mobile {
  padding: 0.25rem 1rem 1rem;
}

.mobile-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(7.5rem, 0.76fr);
  margin-top: 1rem;
  overflow: hidden;
  border: 1px solid var(--site-border);
  border-radius: 1rem;
}

.mobile-row dt {
  grid-column: 1 / -1;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--site-border);
  font-size: 0.9rem;
  font-weight: 900;
  line-height: 1.45;
}

.mobile-row dd {
  display: grid;
  align-content: start;
  gap: 0.45rem;
  min-width: 0;
  padding: 0.85rem 1rem;
}

.mobile-premium-value {
  border-left: 1px solid var(--site-border);
  background: var(--site-bg);
}

.mobile-plan-label {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--site-text-muted);
}

.comparison-disclosure {
  margin-top: 2rem;
}

.comparison-toggle {
  display: flex;
  min-height: 3.5rem;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-inline: auto;
  border: 1px solid var(--site-accent-strong);
  border-radius: 999px;
  padding: 0.8rem 1.4rem;
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--site-accent-strong);
  background: transparent;
}

.comparison-toggle:hover {
  color: var(--site-text);
  background: var(--site-selection);
}

.comparison-toggle svg {
  width: 1.15rem;
  height: 1.15rem;
  transition: transform 180ms ease;
}

.full-comparison-reveal {
  display: grid;
  overflow: hidden;
  grid-template-rows: 1fr;
  opacity: 1;
  transform: translateY(0);
}

.full-comparison-clip {
  min-height: 0;
  overflow: hidden;
}

.full-comparison {
  padding-top: 1.25rem;
  scroll-margin-top: 6rem;
}

.comparison-reveal-enter-active,
.comparison-reveal-leave-active {
  transition:
    grid-template-rows 560ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 340ms ease,
    transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
}

.comparison-reveal-enter-from,
.comparison-reveal-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(-0.5rem);
}

.full-comparison-reveal.is-revealed .comparison-accordion {
  animation: comparison-item-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.full-comparison-reveal.is-revealed .comparison-accordion:nth-of-type(1) { animation-delay: 60ms; }
.full-comparison-reveal.is-revealed .comparison-accordion:nth-of-type(2) { animation-delay: 120ms; }
.full-comparison-reveal.is-revealed .comparison-accordion:nth-of-type(3) { animation-delay: 180ms; }
.full-comparison-reveal.is-revealed .comparison-accordion:nth-of-type(4) { animation-delay: 240ms; }
.full-comparison-reveal.is-revealed .comparison-accordion:nth-of-type(5) { animation-delay: 300ms; }

.comparison-accordion {
  border-radius: 1rem;
  box-shadow: none;
}

.comparison-accordion + .comparison-accordion {
  margin-top: 0.75rem;
}

.comparison-group-toggle {
  display: flex;
  width: 100%;
  min-height: 4.5rem;
  cursor: pointer;
  text-align: left;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
}

.comparison-group-toggle:hover {
  background: var(--site-bg-soft);
}

.comparison-group-toggle > span {
  display: grid;
  gap: 0.2rem;
}

.comparison-group-toggle strong {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--site-text);
}

.comparison-group-toggle small {
  font-size: 0.75rem;
  color: var(--site-text-muted);
}

.comparison-group-toggle > svg {
  width: 1.25rem;
  height: 1.25rem;
  flex: 0 0 auto;
  color: var(--site-accent-strong);
  transition: transform 180ms ease;
}

.comparison-group-toggle[aria-expanded="true"] > svg {
  transform: rotate(180deg);
}

.accordion-content {
  border-top: 1px solid var(--site-border);
}

.accordion-reveal {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
}

.accordion-clip {
  min-height: 0;
  overflow: hidden;
}

.comparison-group-enter-active,
.comparison-group-leave-active {
  transition:
    grid-template-rows 480ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 320ms ease;
}

.comparison-group-enter-from,
.comparison-group-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.comparison-accordion[data-open="true"] .accordion-content .comparison-table tbody tr,
.comparison-accordion[data-open="true"] .accordion-content .mobile-row {
  animation: comparison-row-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.comparison-accordion[data-open="true"] .accordion-content :is(tbody tr, .mobile-row):nth-child(2) { animation-delay: 40ms; }
.comparison-accordion[data-open="true"] .accordion-content :is(tbody tr, .mobile-row):nth-child(3) { animation-delay: 80ms; }
.comparison-accordion[data-open="true"] .accordion-content :is(tbody tr, .mobile-row):nth-child(4) { animation-delay: 120ms; }
.comparison-accordion[data-open="true"] .accordion-content :is(tbody tr, .mobile-row):nth-child(5) { animation-delay: 160ms; }
.comparison-accordion[data-open="true"] .accordion-content :is(tbody tr, .mobile-row):nth-child(6) { animation-delay: 200ms; }
.comparison-accordion[data-open="true"] .accordion-content :is(tbody tr, .mobile-row):nth-child(7) { animation-delay: 240ms; }
.comparison-accordion[data-open="true"] .accordion-content :is(tbody tr, .mobile-row):nth-child(8) { animation-delay: 280ms; }

@keyframes comparison-item-in {
  from {
    opacity: 0;
    transform: translateY(-0.7rem);
  }
}

@keyframes comparison-row-in {
  from {
    opacity: 0;
    transform: translateY(-0.45rem);
  }
}

.comparison-cta {
  max-width: 48rem;
  margin: 3.5rem auto 0;
  text-align: center;
}

.comparison-cta > p:not(.plan-eyebrow) {
  max-width: 42rem;
  margin: 1rem auto 0;
  line-height: 1.75;
  color: var(--site-text-muted);
}

@media (min-width: 40rem) {
  .plan-summary {
    padding: 2.5rem;
  }

}

@media (prefers-reduced-motion: reduce) {
  .comparison-toggle svg,
  .comparison-group-toggle > svg {
    transition: none;
  }

  .comparison-reveal-enter-active,
  .comparison-reveal-leave-active,
  .comparison-group-enter-active,
  .comparison-group-leave-active {
    transition: none;
  }

  .full-comparison-reveal.is-revealed .comparison-accordion,
  .comparison-accordion[data-open="true"] .accordion-content .comparison-table tbody tr,
  .comparison-accordion[data-open="true"] .accordion-content .mobile-row {
    animation: none;
  }
}
</style>
