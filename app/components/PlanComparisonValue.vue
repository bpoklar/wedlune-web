<template>
  <span class="plan-value" :class="`plan-value-${value.state}`">
    <svg v-if="value.state === 'included' || value.state === 'premium'" aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="m4 10.2 3.6 3.6L16 5.7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <svg v-else-if="value.state === 'unavailable'" aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M5 10h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <span>{{ $t(value.labelKey) }}</span>
  </span>
</template>

<script setup lang="ts">
import type { PlanComparisonValue } from "~/data/planComparison";

defineProps<{ value: PlanComparisonValue }>();
</script>

<style scoped>
.plan-value {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1.5;
}

.plan-value svg {
  width: 1.1rem;
  height: 1.1rem;
  flex: 0 0 auto;
  margin-top: 0.1rem;
}

.plan-value-included {
  color: var(--site-success);
}

.plan-value-premium {
  color: var(--site-accent-strong);
}

.plan-value-limited {
  color: var(--site-text);
}

.plan-value-unavailable {
  color: var(--site-text-muted);
}
</style>
