<template>
  <section id="pricing" v-reveal class="motion-reveal comparison-section py-20 sm:py-28" :aria-labelledby="comparisonTitleId">
    <div class="section-shell">
      <div class="mx-auto max-w-3xl text-center">
        <p class="section-kicker">{{ $t("home.pricing.kicker") }}</p>
        <h2 :id="comparisonTitleId" class="section-title">{{ $t("home.pricing.title") }}</h2>
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-2">
        <article class="plan-summary plan-summary-free">
          <p class="plan-eyebrow">{{ $t("home.pricing.free") }}</p>
          <h3>{{ $t("home.pricing.freeTitle") }}</h3>
          <p>{{ $t("home.pricing.freeSubtitle") }}</p>
          <ul>
            <li v-for="item in freeItems" :key="item"><span aria-hidden="true">✓</span>{{ item }}</li>
          </ul>
        </article>

        <article class="plan-summary plan-summary-premium">
          <p class="plan-eyebrow">{{ $t("home.pricing.premium") }}</p>
          <h3>{{ $t("home.pricing.premiumTitle") }}</h3>
          <p>{{ $t("home.pricing.premiumSubtitle") }}</p>
          <ul>
            <li v-for="item in premiumItems" :key="item"><span aria-hidden="true">✓</span>{{ item }}</li>
          </ul>
        </article>
      </div>

      <div class="comparison-panel comparison-preview mt-8" data-comparison-preview>
        <div class="comparison-preview-heading">
          <div>
            <h3>{{ $t("home.pricing.keyDifferences") }}</h3>
            <p>{{ $t("home.pricing.keyDifferencesBody") }}</p>
          </div>
        </div>

        <table class="comparison-table hidden md:table">
          <caption class="sr-only">{{ $t("home.pricing.keyDifferencesCaption") }}</caption>
          <thead>
            <tr>
              <th scope="col">{{ $t("home.pricing.feature") }}</th>
              <th scope="col">{{ $t("home.pricing.free") }}</th>
              <th scope="col" class="premium-column">{{ $t("home.pricing.premium") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comparisonRow in featuredComparisonRows" :key="comparisonRow.id" :data-comparison-row="comparisonRow.id">
              <th scope="row">{{ $t(comparisonRow.labelKey) }}</th>
              <td><PlanComparisonValue :value="comparisonRow.free" /></td>
              <td class="premium-column"><PlanComparisonValue :value="comparisonRow.premium" /></td>
            </tr>
          </tbody>
        </table>

        <dl class="comparison-mobile md:hidden">
          <div v-for="comparisonRow in featuredComparisonRows" :key="comparisonRow.id" class="mobile-row" :data-comparison-row="comparisonRow.id">
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

        <Transition name="comparison-reveal">
          <div
            v-show="showFullComparison"
            :id="fullComparisonPanelId"
            class="full-comparison-reveal"
            :class="{ 'is-revealed': showFullComparison }"
            data-full-comparison
          >
            <div class="full-comparison">
              <details
                v-for="group in planComparisonGroups"
                :key="group.id"
                class="comparison-accordion"
                :data-comparison-group="group.id"
                :open="isGroupOpen(group.id)"
                @toggle="onGroupToggle(group.id, $event)"
              >
                <summary>
                  <span>
                    <strong>{{ $t(group.titleKey) }}</strong>
                    <small>{{ $t("home.pricing.featureCount", { count: group.rows.length }) }}</small>
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                    <path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </summary>

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
              </details>
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
  featuredComparisonRows,
  planComparisonGroups,
} from "~/data/planComparison";

const { tm, rt } = useI18n();
const comparisonTitleId = useId();
const fullComparisonPanelId = useId();
const showFullComparison = ref(false);
const openGroups = ref<Set<string>>(new Set());

const resolveList = (key: string) => (tm(key) as string[]).map((item) => rt(item));
const freeItems = computed(() => resolveList("home.pricing.freeItems"));
const premiumItems = computed(() => resolveList("home.pricing.premiumItems"));

const isGroupOpen = (id: string) => openGroups.value.has(id);

const toggleFullComparison = () => {
  showFullComparison.value = !showFullComparison.value;
  if (!showFullComparison.value) openGroups.value = new Set();
};

const onGroupToggle = async (id: string, event: Event) => {
  const details = event.currentTarget as HTMLDetailsElement;
  if (details.open) {
    const shouldReposition = openGroups.value.size > 0 && !openGroups.value.has(id);
    openGroups.value = new Set([id]);

    if (shouldReposition) {
      await nextTick();
      requestAnimationFrame(() => {
        if (!details.open) return;
        details.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      });
    }
    return;
  }

  if (!openGroups.value.has(id)) return;
  const next = new Set(openGroups.value);
  next.delete(id);
  openGroups.value = next;
};
</script>

<style scoped>
.comparison-section {
  background: var(--site-bg-soft);
}

.plan-summary {
  border: 1px solid var(--site-border);
  border-radius: 1.5rem;
  padding: 2rem;
}

.plan-summary-free {
  background: var(--site-surface);
}

.plan-summary-premium {
  border-color: #cfb083;
  background: #f7eddf;
  box-shadow: 0 22px 55px rgb(104 69 29 / 0.09);
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

.comparison-panel,
.comparison-accordion {
  overflow: hidden;
  border: 1px solid var(--site-border);
  border-radius: 1.5rem;
  background: var(--site-surface);
  box-shadow: 0 18px 50px rgb(36 31 27 / 0.06);
}

.comparison-preview-heading {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--site-border);
}

.comparison-preview-heading h3 {
  font-family: var(--font-display);
  font-size: 1.6rem;
}

.comparison-preview-heading p {
  max-width: 44rem;
  margin-top: 0.4rem;
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--site-text-muted);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.comparison-table th,
.comparison-table td {
  border-bottom: 1px solid #e8ddd0;
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
  background: #f7f0e7;
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
  background: #fdf8f0;
}

.comparison-table thead .premium-column {
  color: var(--site-accent-strong);
  background: #f1e3d0;
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
  border: 1px solid #e5d8c8;
  border-radius: 1rem;
}

.mobile-row dt {
  grid-column: 1 / -1;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #e5d8c8;
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
  border-left: 1px solid #e5d8c8;
  background: #fdf8f0;
}

.mobile-plan-label {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--site-text-muted);
}

.comparison-disclosure {
  margin-top: 1.25rem;
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
  color: white;
  background: var(--site-accent-strong);
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

.full-comparison {
  min-height: 0;
  margin-top: 1.25rem;
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

.comparison-accordion summary {
  display: flex;
  min-height: 4.5rem;
  cursor: pointer;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
}

.comparison-accordion summary::-webkit-details-marker {
  display: none;
}

.comparison-accordion summary:hover {
  background: #f8f1e8;
}

.comparison-accordion summary > span {
  display: grid;
  gap: 0.2rem;
}

.comparison-accordion summary strong {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--site-text);
}

.comparison-accordion summary small {
  font-size: 0.75rem;
  color: var(--site-text-muted);
}

.comparison-accordion summary > svg {
  width: 1.25rem;
  height: 1.25rem;
  flex: 0 0 auto;
  color: var(--site-accent-strong);
  transition: transform 180ms ease;
}

.comparison-accordion[open] summary > svg {
  transform: rotate(180deg);
}

.accordion-content {
  border-top: 1px solid var(--site-border);
}

.comparison-accordion[open] .accordion-content {
  animation: accordion-content-in 440ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.comparison-accordion[open] .accordion-content .comparison-table tbody tr,
.comparison-accordion[open] .accordion-content .mobile-row {
  animation: comparison-row-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.comparison-accordion[open] .accordion-content :is(tbody tr, .mobile-row):nth-child(2) { animation-delay: 40ms; }
.comparison-accordion[open] .accordion-content :is(tbody tr, .mobile-row):nth-child(3) { animation-delay: 80ms; }
.comparison-accordion[open] .accordion-content :is(tbody tr, .mobile-row):nth-child(4) { animation-delay: 120ms; }
.comparison-accordion[open] .accordion-content :is(tbody tr, .mobile-row):nth-child(5) { animation-delay: 160ms; }
.comparison-accordion[open] .accordion-content :is(tbody tr, .mobile-row):nth-child(6) { animation-delay: 200ms; }
.comparison-accordion[open] .accordion-content :is(tbody tr, .mobile-row):nth-child(7) { animation-delay: 240ms; }
.comparison-accordion[open] .accordion-content :is(tbody tr, .mobile-row):nth-child(8) { animation-delay: 280ms; }

@keyframes comparison-item-in {
  from {
    opacity: 0;
    transform: translateY(-0.7rem);
  }
}

@keyframes accordion-content-in {
  from {
    opacity: 0;
    transform: translateY(-0.4rem);
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

  .comparison-preview-heading {
    padding: 1.75rem 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .comparison-toggle svg,
  .comparison-accordion summary > svg {
    transition: none;
  }

  .comparison-reveal-enter-active,
  .comparison-reveal-leave-active {
    transition: none;
  }

  .full-comparison-reveal.is-revealed .comparison-accordion,
  .comparison-accordion[open] .accordion-content,
  .comparison-accordion[open] .accordion-content .comparison-table tbody tr,
  .comparison-accordion[open] .accordion-content .mobile-row {
    animation: none;
  }
}
</style>
